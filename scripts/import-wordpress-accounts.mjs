import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");

const config = {
  sshHost: process.env.WORDPRESS_SSH_HOST,
  sshPort: process.env.WORDPRESS_SSH_PORT || "6543",
  sshUser: process.env.WORDPRESS_SSH_USER || "root",
  dbContainer: process.env.WORDPRESS_DB_CONTAINER || "wp-mysql-prod",
  dbName: process.env.WORDPRESS_DB_NAME || "wordpress",
  dbUser: process.env.WORDPRESS_DB_USER,
  dbPassword: process.env.WORDPRESS_DB_PASSWORD,
};

function assertImportConfig() {
  const missing = [];

  if (!config.sshHost) missing.push("WORDPRESS_SSH_HOST");
  if (!config.dbUser) missing.push("WORDPRESS_DB_USER");
  if (!config.dbPassword) missing.push("WORDPRESS_DB_PASSWORD");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

function runRemoteMysql(query) {
  const remoteTarget = `${config.sshUser}@${config.sshHost}`;
  const remoteCommand = [
    "docker",
    "exec",
    "-i",
    config.dbContainer,
    "mysql",
    "--batch",
    "--raw",
    "--skip-column-names",
    `-u${config.dbUser}`,
    `-p${config.dbPassword}`,
    config.dbName,
  ];

  const result = spawnSync(
    "ssh",
    ["-F", "/dev/null", "-p", config.sshPort, remoteTarget, remoteCommand.join(" ")],
    {
      encoding: "utf8",
      input: query,
      maxBuffer: 1024 * 1024 * 64,
    },
  );

  if (result.status !== 0) {
    throw new Error(
      `Remote MySQL query failed: ${result.stderr || result.stdout || "unknown error"}`,
    );
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

function parseRows(lines, mapper) {
  return lines.map((line) => mapper(line.split("\t")));
}

function asTrimmedString(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
}

function normalizeEmail(value) {
  const normalized = asTrimmedString(value)?.toLowerCase() || null;
  if (!normalized) {
    return null;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

function parseInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function parseRemoteDate(value) {
  const raw = asTrimmedString(value);
  if (!raw || raw === "0") {
    return null;
  }

  if (/^\d+$/.test(raw)) {
    const numeric = Number.parseInt(raw, 10);
    if (Number.isFinite(numeric) && numeric > 0) {
      const date = new Date((raw.length > 10 ? numeric : numeric * 1000));
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
  }

  const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(`${isoLike}${isoLike.endsWith("Z") ? "" : "Z"}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function roundMoney(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const normalized = asTrimmedString(value);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function clampHeightFeet(value) {
  const parsed = parseInteger(value);
  return parsed !== null && parsed >= 2 && parsed <= 8 ? parsed : null;
}

function clampHeightInches(value) {
  const parsed = parseInteger(value);
  return parsed !== null && parsed >= 0 && parsed <= 11 ? parsed : null;
}

function clampWeight(value) {
  const parsed = parseNumber(value);
  return parsed !== null && parsed >= 60 && parsed <= 1200 ? parsed : null;
}

function calculateBmi(feet, inches, weight) {
  if (
    !Number.isFinite(feet) ||
    !Number.isFinite(inches) ||
    !Number.isFinite(weight)
  ) {
    return null;
  }

  const totalInches = feet * 12 + inches;
  if (totalInches <= 0) {
    return null;
  }

  return roundMoney((weight / (totalInches * totalInches)) * 703);
}

function addMonths(date, months = 1) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function stripLegacyPrefix(value) {
  return String(value ?? "")
    .trim()
    .replace(/^[a-z_]+::/i, "");
}

function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value ?? "").trim(),
  );
}

function resolveRole(capabilities) {
  return String(capabilities || "").includes("administrator")
    ? "ADMIN"
    : "CUSTOMER";
}

function buildDisplayName(record) {
  const fromNames = [record.firstName, record.lastName].filter(Boolean).join(" ");
  if (fromNames) {
    return fromNames;
  }

  const display = firstNonEmpty(record.displayName);
  if (display && !display.includes("@")) {
    return display;
  }

  const login = firstNonEmpty(record.userLogin);
  if (login && !login.includes("@")) {
    return login;
  }

  return null;
}

function mapSubscriptionStatus(row) {
  const rawStatus = String(row.subscriptionStatus || "")
    .trim()
    .toLowerCase();
  const refunded = String(row.refundStatus || "")
    .trim()
    .toLowerCase();

  if (refunded === "refunded") {
    return "CANCELED";
  }

  if (rawStatus === "active") {
    return "ACTIVE";
  }

  if (rawStatus === "trialing") {
    return "TRIALING";
  }

  if (rawStatus === "past_due" || rawStatus === "unpaid" || rawStatus === "incomplete") {
    return "PAST_DUE";
  }

  if (rawStatus === "canceled" || rawStatus === "cancelled") {
    return "CANCELED";
  }

  if (rawStatus === "expired" || rawStatus === "incomplete_expired") {
    return "EXPIRED";
  }

  return "ACTIVE";
}

function mapOrderStatus(value) {
  switch (String(value || "").trim().toLowerCase()) {
    case "wc-processing":
      return "PROCESSING";
    case "wc-completed":
      return "DELIVERED";
    case "wc-cancelled":
    case "wc-canceled":
      return "CANCELLED";
    case "wc-refunded":
      return "REFUNDED";
    case "wc-pending":
    case "wc-on-hold":
    case "wc-failed":
    default:
      return "PENDING";
  }
}

function mapStripePaymentStatus(orderStatus) {
  switch (orderStatus) {
    case "PROCESSING":
    case "DELIVERED":
      return "paid";
    case "REFUNDED":
      return "refunded";
    case "CANCELLED":
      return "canceled";
    default:
      return "pending";
  }
}

function cleanLegacyText(value) {
  return String(value ?? "")
    .replace(/\uFFFD/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSubscriptionPlanName(row, months) {
  const medication = firstNonEmpty(row.medicationName, "Imported subscription");
  if (!months || months <= 1) {
    return medication;
  }

  return `${medication} - ${months}-month plan`;
}

function shouldImportSubscription(row) {
  const medication = asTrimmedString(row.medicationName);
  const stripeId = asTrimmedString(row.stripeSubscriptionId);
  const paymentMethodType = asTrimmedString(row.paymentMethodTypes)?.toLowerCase();
  const duration = parseInteger(row.subscriptionDuration) || 0;

  if (!medication) {
    return false;
  }

  if (stripeId && stripeId.startsWith("pi_")) {
    return false;
  }

  if (
    !stripeId &&
    duration <= 0 &&
    (paymentMethodType === "klarna" || paymentMethodType === "afterpay_clearpay")
  ) {
    return false;
  }

  return true;
}

function normalizeDefaultAddress(candidate) {
  if (!candidate) {
    return null;
  }

  const line1 = asTrimmedString(candidate.line1);
  const city = asTrimmedString(candidate.city);
  const state = asTrimmedString(candidate.state);
  const zip = asTrimmedString(candidate.zip);

  if (!line1 && !city && !state && !zip) {
    return null;
  }

  return {
    line1: line1 || "Unknown",
    line2: asTrimmedString(candidate.line2),
    city: city || "Unknown",
    state: state || "NA",
    zip: zip || "00000",
    country: asTrimmedString(candidate.country) || "US",
  };
}

function getPreferredPatientEmail(patient) {
  return (
    normalizeEmail(patient.contactEmail) ||
    normalizeEmail(patient.patientEmail) ||
    null
  );
}

function loadWordPressUsers() {
  const lines = runRemoteMysql(`
    SELECT
      u.ID,
      COALESCE(u.user_login, ''),
      COALESCE(u.user_email, ''),
      COALESCE(u.display_name, ''),
      COALESCE(u.user_pass, ''),
      COALESCE(u.user_registered, ''),
      COALESCE(MAX(CASE WHEN um.meta_key = 'first_name' THEN um.meta_value END), ''),
      COALESCE(MAX(CASE WHEN um.meta_key = 'last_name' THEN um.meta_value END), ''),
      COALESCE(MAX(CASE WHEN um.meta_key = 'wp_capabilities' THEN um.meta_value END), '')
    FROM wp_users u
    LEFT JOIN wp_usermeta um
      ON um.user_id = u.ID
      AND um.meta_key IN ('first_name', 'last_name', 'wp_capabilities')
    GROUP BY
      u.ID, u.user_login, u.user_email, u.display_name, u.user_pass, u.user_registered
    ORDER BY u.ID ASC;
  `);

  return parseRows(lines, ([
    id,
    userLogin,
    userEmail,
    displayName,
    userPass,
    userRegistered,
    firstName,
    lastName,
    capabilities,
  ]) => ({
    id: parseInteger(id),
    userLogin: asTrimmedString(userLogin),
    email: normalizeEmail(userEmail),
    displayName: asTrimmedString(displayName),
    passwordHash: asTrimmedString(userPass),
    registeredAt: parseRemoteDate(userRegistered),
    firstName: asTrimmedString(firstName),
    lastName: asTrimmedString(lastName),
    capabilities: asTrimmedString(capabilities),
  }));
}

function loadPatients() {
  const lines = runRemoteMysql(`
    SELECT
      id,
      COALESCE(patient_email, ''),
      COALESCE(contact_email, ''),
      COALESCE(first_name, ''),
      COALESCE(last_name, ''),
      COALESCE(dob, ''),
      COALESCE(feet, ''),
      COALESCE(inches, ''),
      COALESCE(weight, ''),
      COALESCE(city, ''),
      COALESCE(state, ''),
      COALESCE(zip_code, ''),
      COALESCE(address, ''),
      COALESCE(phone, ''),
      COALESCE(telegra_patient_id, ''),
      COALESCE(stripe_customer_id, ''),
      COALESCE(opt_in_messages, ''),
      COALESCE(receive_updates, ''),
      COALESCE(created_at, ''),
      COALESCE(updated_at, ''),
      COALESCE(is_deleted, '')
    FROM wp_healsend_patients
    WHERE COALESCE(is_deleted, 0) = 0
    ORDER BY id ASC;
  `);

  return parseRows(lines, ([
    id,
    patientEmail,
    contactEmail,
    firstName,
    lastName,
    dob,
    feet,
    inches,
    weight,
    city,
    state,
    zipCode,
    address,
    phone,
    telegraPatientId,
    stripeCustomerId,
    optInMessages,
    receiveUpdates,
    createdAt,
    updatedAt,
    isDeleted,
  ]) => ({
    id: parseInteger(id),
    patientEmail: normalizeEmail(patientEmail),
    contactEmail: normalizeEmail(contactEmail),
    firstName: asTrimmedString(firstName),
    lastName: asTrimmedString(lastName),
    dateOfBirth: parseRemoteDate(dob),
    feet: clampHeightFeet(feet),
    inches: clampHeightInches(inches),
    weight: clampWeight(weight),
    city: asTrimmedString(city),
    state: asTrimmedString(state),
    zipCode: asTrimmedString(zipCode),
    address: asTrimmedString(address),
    phone: asTrimmedString(phone),
    mdiPatientId: (() => {
      const stripped = stripLegacyPrefix(telegraPatientId);
      return isUuidLike(stripped) ? stripped : null;
    })(),
    stripeCustomerId: asTrimmedString(stripeCustomerId),
    textAlerts: parseBoolean(optInMessages) || parseBoolean(receiveUpdates),
    createdAt: parseRemoteDate(createdAt),
    updatedAt: parseRemoteDate(updatedAt),
    isDeleted: parseBoolean(isDeleted),
  }));
}

function loadSubscriptions() {
  const lines = runRemoteMysql(`
    SELECT
      id,
      COALESCE(user_id, ''),
      COALESCE(patient_email, ''),
      COALESCE(subscription_duration, ''),
      COALESCE(medication_name, ''),
      COALESCE(stripe_product_id, ''),
      COALESCE(subscription_monthly_amount, ''),
      COALESCE(stripe_subscription_id, ''),
      COALESCE(stripe_customer_id, ''),
      COALESCE(stripe_invoice_id, ''),
      COALESCE(subscription_status, ''),
      COALESCE(subscription_start, ''),
      COALESCE(subscription_end, ''),
      COALESCE(cancel_at_period_end, ''),
      COALESCE(invoice_pdf_url, ''),
      COALESCE(hosted_invoice_url, ''),
      COALESCE(subscription_slug, ''),
      COALESCE(affiliate_id, ''),
      COALESCE(wc_order_id, ''),
      COALESCE(refund_status, ''),
      COALESCE(payment_method_types, '')
    FROM wp_healsend_subscriptions
    ORDER BY id ASC;
  `);

  return parseRows(lines, ([
    id,
    userId,
    patientEmail,
    subscriptionDuration,
    medicationName,
    stripeProductId,
    subscriptionMonthlyAmount,
    stripeSubscriptionId,
    stripeCustomerId,
    stripeInvoiceId,
    subscriptionStatus,
    subscriptionStart,
    subscriptionEnd,
    cancelAtPeriodEnd,
    invoicePdfUrl,
    hostedInvoiceUrl,
    subscriptionSlug,
    affiliateId,
    wcOrderId,
    refundStatus,
    paymentMethodTypes,
  ]) => ({
    id: parseInteger(id),
    userId: parseInteger(userId),
    patientEmail: normalizeEmail(patientEmail),
    subscriptionDuration: parseInteger(subscriptionDuration),
    medicationName: asTrimmedString(medicationName),
    stripeProductId: asTrimmedString(stripeProductId),
    subscriptionMonthlyAmount: parseNumber(subscriptionMonthlyAmount),
    stripeSubscriptionId: asTrimmedString(stripeSubscriptionId),
    stripeCustomerId: asTrimmedString(stripeCustomerId),
    stripeInvoiceId: asTrimmedString(stripeInvoiceId),
    subscriptionStatus: asTrimmedString(subscriptionStatus),
    subscriptionStart: parseRemoteDate(subscriptionStart),
    subscriptionEnd: parseRemoteDate(subscriptionEnd),
    cancelAtPeriodEnd: parseBoolean(cancelAtPeriodEnd),
    invoicePdfUrl: asTrimmedString(invoicePdfUrl),
    hostedInvoiceUrl: asTrimmedString(hostedInvoiceUrl),
    subscriptionSlug: asTrimmedString(subscriptionSlug),
    affiliateId: asTrimmedString(affiliateId),
    wcOrderId: parseInteger(wcOrderId),
    refundStatus: asTrimmedString(refundStatus),
    paymentMethodTypes: asTrimmedString(paymentMethodTypes),
  }));
}

function loadPayments() {
  const lines = runRemoteMysql(`
    SELECT
      id,
      COALESCE(patient_email, ''),
      COALESCE(payment_token, ''),
      COALESCE(card_brand, ''),
      COALESCE(card_last4, ''),
      COALESCE(created_at, '')
    FROM wp_healsend_payments
    ORDER BY id ASC;
  `);

  return parseRows(lines, ([id, patientEmail, paymentToken, cardBrand, cardLast4, createdAt]) => ({
    id: parseInteger(id),
    patientEmail: normalizeEmail(patientEmail),
    paymentToken: asTrimmedString(paymentToken),
    cardBrand: asTrimmedString(cardBrand),
    cardLast4: asTrimmedString(cardLast4),
    createdAt: parseRemoteDate(createdAt),
  }));
}

function loadWcOrders() {
  const lines = runRemoteMysql(`
    SELECT
      id,
      COALESCE(status, ''),
      COALESCE(customer_id, ''),
      COALESCE(billing_email, ''),
      COALESCE(tax_amount, ''),
      COALESCE(total_amount, ''),
      COALESCE(payment_method, ''),
      COALESCE(transaction_id, ''),
      COALESCE(date_created_gmt, ''),
      COALESCE(date_updated_gmt, '')
    FROM wp_wc_orders
    WHERE type = 'shop_order'
    ORDER BY id ASC;
  `);

  return parseRows(lines, ([
    id,
    status,
    customerId,
    billingEmail,
    taxAmount,
    totalAmount,
    paymentMethod,
    transactionId,
    createdAt,
    updatedAt,
  ]) => ({
    id: parseInteger(id),
    status: asTrimmedString(status),
    customerId: parseInteger(customerId),
    billingEmail: normalizeEmail(billingEmail),
    taxAmount: parseNumber(taxAmount) || 0,
    totalAmount: parseNumber(totalAmount) || 0,
    paymentMethod: asTrimmedString(paymentMethod),
    transactionId: asTrimmedString(transactionId),
    createdAt: parseRemoteDate(createdAt),
    updatedAt: parseRemoteDate(updatedAt),
  }));
}

function loadWcOrderMeta() {
  const lines = runRemoteMysql(`
    SELECT
      order_id,
      meta_key,
      COALESCE(meta_value, '')
    FROM wp_wc_orders_meta
    WHERE meta_key IN (
      '_payment_method',
      '_payment_method_title',
      '_stripe_subscription_id',
      '_healsend_duration',
      '_healsend_medication',
      '_healsend_plan_slug',
      'hld_ghl_contact_id'
    )
    ORDER BY order_id ASC;
  `);

  const metaByOrderId = new Map();

  for (const [orderId, metaKey, metaValue] of parseRows(lines, (parts) => parts)) {
    const normalizedOrderId = parseInteger(orderId);
    if (!normalizedOrderId) {
      continue;
    }

    const bucket = metaByOrderId.get(normalizedOrderId) || {};
    bucket[metaKey] = asTrimmedString(metaValue);
    metaByOrderId.set(normalizedOrderId, bucket);
  }

  return metaByOrderId;
}

function loadWcOrderAddresses() {
  const lines = runRemoteMysql(`
    SELECT
      order_id,
      COALESCE(address_type, ''),
      COALESCE(first_name, ''),
      COALESCE(last_name, ''),
      COALESCE(address_1, ''),
      COALESCE(address_2, ''),
      COALESCE(city, ''),
      COALESCE(state, ''),
      COALESCE(postcode, ''),
      COALESCE(country, ''),
      COALESCE(email, ''),
      COALESCE(phone, '')
    FROM wp_wc_order_addresses
    ORDER BY order_id ASC;
  `);

  const addressesByOrderId = new Map();

  for (const [
    orderId,
    addressType,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    postcode,
    country,
    email,
    phone,
  ] of parseRows(lines, (parts) => parts)) {
    const normalizedOrderId = parseInteger(orderId);
    if (!normalizedOrderId) {
      continue;
    }

    const entry = addressesByOrderId.get(normalizedOrderId) || {};
    entry[addressType] = {
      firstName: asTrimmedString(firstName),
      lastName: asTrimmedString(lastName),
      line1: asTrimmedString(address1),
      line2: asTrimmedString(address2),
      city: asTrimmedString(city),
      state: asTrimmedString(state),
      zip: asTrimmedString(postcode),
      country: asTrimmedString(country),
      email: normalizeEmail(email),
      phone: asTrimmedString(phone),
    };
    addressesByOrderId.set(normalizedOrderId, entry);
  }

  return addressesByOrderId;
}

function loadWcOrderItems() {
  const lines = runRemoteMysql(`
    SELECT
      oi.order_id,
      oi.order_item_id,
      COALESCE(oi.order_item_name, ''),
      COALESCE(MAX(CASE WHEN oim.meta_key = '_product_id' THEN oim.meta_value END), ''),
      COALESCE(MAX(CASE WHEN oim.meta_key = '_variation_id' THEN oim.meta_value END), ''),
      COALESCE(MAX(CASE WHEN oim.meta_key = '_qty' THEN oim.meta_value END), ''),
      COALESCE(MAX(CASE WHEN oim.meta_key = '_line_total' THEN oim.meta_value END), ''),
      COALESCE(MAX(CASE WHEN oim.meta_key = 'plan_duration' THEN oim.meta_value END), '')
    FROM wp_woocommerce_order_items oi
    LEFT JOIN wp_woocommerce_order_itemmeta oim
      ON oim.order_item_id = oi.order_item_id
    WHERE oi.order_item_type = 'line_item'
    GROUP BY oi.order_id, oi.order_item_id, oi.order_item_name
    ORDER BY oi.order_id ASC, oi.order_item_id ASC;
  `);

  const itemsByOrderId = new Map();

  for (const [
    orderId,
    orderItemId,
    orderItemName,
    productId,
    variationId,
    quantity,
    lineTotal,
    planDuration,
  ] of parseRows(lines, (parts) => parts)) {
    const normalizedOrderId = parseInteger(orderId);
    if (!normalizedOrderId) {
      continue;
    }

    const items = itemsByOrderId.get(normalizedOrderId) || [];
    items.push({
      orderItemId: parseInteger(orderItemId),
      name: cleanLegacyText(orderItemName),
      wcProductId: parseInteger(productId),
      wcVariationId: parseInteger(variationId),
      quantity: parseInteger(quantity) || 1,
      lineTotal: parseNumber(lineTotal) || 0,
      planDuration: asTrimmedString(planDuration),
    });
    itemsByOrderId.set(normalizedOrderId, items);
  }

  return itemsByOrderId;
}

function buildPatientLookups(patients) {
  const byEmail = new Map();

  for (const patient of patients) {
    const email = getPreferredPatientEmail(patient);
    if (email) {
      const existing = byEmail.get(email);
      if (!existing || (patient.updatedAt || patient.createdAt) > (existing.updatedAt || existing.createdAt)) {
        byEmail.set(email, patient);
      }
    }
  }

  return { byEmail };
}

function buildSubscriptionLookups(subscriptions) {
  const byUserId = new Map();
  const byEmail = new Map();

  for (const subscription of subscriptions.filter(shouldImportSubscription)) {
    if (subscription.userId) {
      const bucket = byUserId.get(subscription.userId) || [];
      bucket.push(subscription);
      byUserId.set(subscription.userId, bucket);
    }

    if (subscription.patientEmail) {
      const bucket = byEmail.get(subscription.patientEmail) || [];
      bucket.push(subscription);
      byEmail.set(subscription.patientEmail, bucket);
    }
  }

  return { byUserId, byEmail };
}

function mergeUserSeed(target, incoming) {
  if (!incoming.email) {
    return target;
  }

  const next = target || {
    email: incoming.email,
    sourceUserId: incoming.sourceUserId || null,
    passwordHash: null,
    name: null,
    phone: null,
    dateOfBirth: null,
    role: "CUSTOMER",
    stripeCustomerId: null,
    mdiPatientId: null,
    textAlerts: false,
    feet: null,
    inches: null,
    weight: null,
    bmi: null,
    address: null,
    createdAt: incoming.createdAt || null,
  };

  next.sourceUserId = next.sourceUserId || incoming.sourceUserId || null;
  next.passwordHash = next.passwordHash || incoming.passwordHash || null;
  next.name = next.name || incoming.name || null;
  next.phone = next.phone || incoming.phone || null;
  next.dateOfBirth = next.dateOfBirth || incoming.dateOfBirth || null;
  next.role =
    next.role === "ADMIN" || incoming.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
  next.stripeCustomerId =
    next.stripeCustomerId || incoming.stripeCustomerId || null;
  next.mdiPatientId = next.mdiPatientId || incoming.mdiPatientId || null;
  next.textAlerts = next.textAlerts || incoming.textAlerts || false;
  next.feet = next.feet ?? incoming.feet ?? null;
  next.inches = next.inches ?? incoming.inches ?? null;
  next.weight = next.weight ?? incoming.weight ?? null;
  next.bmi = next.bmi ?? incoming.bmi ?? null;
  next.address = next.address || incoming.address || null;
  next.createdAt =
    next.createdAt && incoming.createdAt
      ? next.createdAt < incoming.createdAt
        ? next.createdAt
        : incoming.createdAt
      : next.createdAt || incoming.createdAt || null;

  return next;
}

function buildUserSeeds(wordpressUsers, patients, subscriptions) {
  const patientLookups = buildPatientLookups(patients);
  const subscriptionLookups = buildSubscriptionLookups(subscriptions);
  const seedsByEmail = new Map();

  for (const wpUser of wordpressUsers) {
    const patient = wpUser.email ? patientLookups.byEmail.get(wpUser.email) : null;

    const relatedSubscriptions = [
      ...(wpUser.id ? subscriptionLookups.byUserId.get(wpUser.id) || [] : []),
      ...(wpUser.email ? subscriptionLookups.byEmail.get(wpUser.email) || [] : []),
    ];

    const seed = mergeUserSeed(seedsByEmail.get(wpUser.email), {
      email: wpUser.email,
      sourceUserId: wpUser.id,
      passwordHash: wpUser.passwordHash,
      name: buildDisplayName({
        firstName: patient?.firstName || wpUser.firstName,
        lastName: patient?.lastName || wpUser.lastName,
        displayName: wpUser.displayName,
        userLogin: wpUser.userLogin,
      }),
      phone: patient?.phone || null,
      dateOfBirth: patient?.dateOfBirth || null,
      role: resolveRole(wpUser.capabilities),
      stripeCustomerId:
        patient?.stripeCustomerId ||
        relatedSubscriptions.find((item) => item.stripeCustomerId)?.stripeCustomerId ||
        null,
      mdiPatientId: patient?.mdiPatientId || null,
      textAlerts: patient?.textAlerts || false,
      feet: patient?.feet ?? null,
      inches: patient?.inches ?? null,
      weight: patient?.weight ?? null,
      bmi: calculateBmi(patient?.feet, patient?.inches, patient?.weight),
      address: normalizeDefaultAddress(
        patient
          ? {
              line1: patient.address,
              city: patient.city,
              state: patient.state,
              zip: patient.zipCode,
              country: "US",
            }
          : null,
      ),
      createdAt: wpUser.registeredAt || patient?.createdAt || null,
    });

    if (seed?.email) {
      seedsByEmail.set(seed.email, seed);
    }
  }

  for (const patient of patients) {
    const email = getPreferredPatientEmail(patient);
    if (!email) {
      continue;
    }

    const relatedSubscriptions = [
      ...(subscriptionLookups.byEmail.get(email) || []),
    ];

    const seed = mergeUserSeed(seedsByEmail.get(email), {
      email,
      sourceUserId: null,
      passwordHash: null,
      name: buildDisplayName({
        firstName: patient.firstName,
        lastName: patient.lastName,
      }),
      phone: patient.phone || null,
      dateOfBirth: patient.dateOfBirth || null,
      role: "CUSTOMER",
      stripeCustomerId:
        patient.stripeCustomerId ||
        relatedSubscriptions.find((item) => item.stripeCustomerId)?.stripeCustomerId ||
        null,
      mdiPatientId: patient.mdiPatientId || null,
      textAlerts: patient.textAlerts || false,
      feet: patient.feet ?? null,
      inches: patient.inches ?? null,
      weight: patient.weight ?? null,
      bmi: calculateBmi(patient.feet, patient.inches, patient.weight),
      address: normalizeDefaultAddress({
        line1: patient.address,
        city: patient.city,
        state: patient.state,
        zip: patient.zipCode,
        country: "US",
      }),
      createdAt: patient.createdAt || null,
    });

    seedsByEmail.set(email, seed);
  }

  return [...seedsByEmail.values()].filter((seed) => seed.email);
}

async function upsertUsers(userSeeds) {
  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
    mdiConflicts: 0,
  };

  const localUsersByEmail = new Map();
  const wpUserIdToLocalUserId = new Map();
  const assignedMdiPatientIds = new Map();

  const existingUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      mdiPatientId: true,
      stripeCustomerId: true,
      passwordHash: true,
    },
  });

  for (const user of existingUsers) {
    localUsersByEmail.set(user.email.toLowerCase(), user);
    if (user.mdiPatientId) {
      assignedMdiPatientIds.set(user.mdiPatientId, user.id);
    }
  }

  for (const seed of userSeeds) {
    if (!seed.email) {
      stats.skipped += 1;
      continue;
    }

    const existing = localUsersByEmail.get(seed.email);
    let mdiPatientId = seed.mdiPatientId;
    if (mdiPatientId) {
      const assignedUserId = assignedMdiPatientIds.get(mdiPatientId);
      if (assignedUserId && assignedUserId !== existing?.id) {
        mdiPatientId = null;
        stats.mdiConflicts += 1;
      }
    }

    const createData = {
      email: seed.email,
      passwordHash: seed.passwordHash || null,
      name: seed.name || null,
      phone: seed.phone || null,
      dateOfBirth: seed.dateOfBirth || null,
      role: seed.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
      stripeCustomerId: seed.stripeCustomerId || null,
      mdiPatientId,
      createdAt: seed.createdAt || undefined,
    };

    const updateData = {
      passwordHash: seed.passwordHash || existing?.passwordHash || null,
      name: seed.name || existing?.name || null,
      phone: seed.phone || null,
      dateOfBirth: seed.dateOfBirth || null,
      role:
        existing?.role === "ADMIN" || seed.role === "ADMIN"
          ? "ADMIN"
          : "CUSTOMER",
      stripeCustomerId: seed.stripeCustomerId || existing?.stripeCustomerId || null,
      mdiPatientId: mdiPatientId || existing?.mdiPatientId || null,
    };

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: updateData,
          select: { id: true, email: true, mdiPatientId: true },
        })
      : await prisma.user.create({
          data: createData,
          select: { id: true, email: true, mdiPatientId: true },
        });

    if (existing) {
      stats.updated += 1;
    } else {
      stats.created += 1;
    }

    localUsersByEmail.set(user.email.toLowerCase(), {
      ...existing,
      ...user,
      role: updateData.role,
      stripeCustomerId: updateData.stripeCustomerId,
      passwordHash: updateData.passwordHash,
      name: updateData.name,
    });

    if (seed.sourceUserId) {
      wpUserIdToLocalUserId.set(seed.sourceUserId, user.id);
    }
    if (user.mdiPatientId) {
      assignedMdiPatientIds.set(user.mdiPatientId, user.id);
    }

    await prisma.onboarding.upsert({
      where: { userId: user.id },
      update: {
        feet: seed.feet ?? null,
        inches: seed.inches ?? null,
        weight: seed.weight ?? null,
        bmi: seed.bmi ?? null,
        textAlerts: !!seed.textAlerts,
        completedAt:
          seed.feet !== null || seed.inches !== null || seed.weight !== null
            ? seed.createdAt || new Date()
            : null,
      },
      create: {
        userId: user.id,
        feet: seed.feet ?? null,
        inches: seed.inches ?? null,
        weight: seed.weight ?? null,
        bmi: seed.bmi ?? null,
        textAlerts: !!seed.textAlerts,
        completedAt:
          seed.feet !== null || seed.inches !== null || seed.weight !== null
            ? seed.createdAt || new Date()
            : null,
      },
    });

    if (seed.address) {
      const existingAddress = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
        select: { id: true },
      });

      if (existingAddress) {
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            line1: seed.address.line1,
            line2: seed.address.line2,
            city: seed.address.city,
            state: seed.address.state,
            zip: seed.address.zip,
            country: seed.address.country,
            isDefault: true,
          },
        });
      } else {
        await prisma.address.create({
          data: {
            userId: user.id,
            line1: seed.address.line1,
            line2: seed.address.line2,
            city: seed.address.city,
            state: seed.address.state,
            zip: seed.address.zip,
            country: seed.address.country,
            isDefault: true,
          },
        });
      }
    }
  }

  return { stats, localUsersByEmail, wpUserIdToLocalUserId };
}

async function importPaymentMethods(payments, userLookups) {
  const stats = {
    created: 0,
    skipped: 0,
  };

  const importedByUserId = new Map();

  const sortedPayments = [...payments].sort((a, b) => {
    const left = a.createdAt?.getTime() || 0;
    const right = b.createdAt?.getTime() || 0;
    return left - right;
  });

  for (const payment of sortedPayments) {
    const user = payment.patientEmail
      ? userLookups.localUsersByEmail.get(payment.patientEmail)
      : null;

    if (!user || !payment.paymentToken) {
      stats.skipped += 1;
      continue;
    }

    const existing = await prisma.paymentMethod.findFirst({
      where: {
        userId: user.id,
        stripePaymentMethodId: payment.paymentToken,
      },
      select: { id: true },
    });

    if (existing) {
      continue;
    }

    const bucket = importedByUserId.get(user.id) || [];
    bucket.push(payment.paymentToken);
    importedByUserId.set(user.id, bucket);

    await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        stripePaymentMethodId: payment.paymentToken,
        brand: payment.cardBrand || null,
        last4: payment.cardLast4 || null,
        isDefault: false,
        createdAt: payment.createdAt || undefined,
      },
    });
    stats.created += 1;
  }

  for (const [userId] of importedByUserId) {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { id: true },
    });

    if (methods.length === 0) {
      continue;
    }

    await prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    await prisma.paymentMethod.update({
      where: { id: methods[0].id },
      data: { isDefault: true },
    });
  }

  return stats;
}

async function importSubscriptions(subscriptions, userLookups) {
  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
    filteredBnpl: 0,
  };

  for (const row of subscriptions) {
    if (!shouldImportSubscription(row)) {
      stats.filteredBnpl += 1;
      continue;
    }

    const userId =
      (row.userId ? userLookups.wpUserIdToLocalUserId.get(row.userId) : null) ||
      (row.patientEmail
        ? userLookups.localUsersByEmail.get(row.patientEmail)?.id
        : null) ||
      null;

    if (!userId) {
      stats.skipped += 1;
      continue;
    }

    const months = row.subscriptionDuration && row.subscriptionDuration > 0
      ? row.subscriptionDuration
      : 1;
    const totalAmount = row.subscriptionMonthlyAmount || 0;
    const recurringAmount =
      months > 1 ? roundMoney(totalAmount / months) : roundMoney(totalAmount);
    const stripeSubscriptionId =
      row.stripeSubscriptionId || `legacy_wp_subscription_${row.id}`;
    const status = mapSubscriptionStatus(row);
    const startDate = row.subscriptionStart || new Date();
    const nextBillingDate =
      status === "ACTIVE" || status === "TRIALING" || status === "PAST_DUE"
        ? addMonths(startDate, 1)
        : null;
    const endDate = row.subscriptionEnd || null;
    const notes = [
      `Imported from WordPress subscription #${row.id}`,
      row.subscriptionSlug ? `slug=${row.subscriptionSlug}` : null,
      row.paymentMethodTypes ? `payment_method=${row.paymentMethodTypes}` : null,
      row.wcOrderId ? `wc_order_id=${row.wcOrderId}` : null,
      totalAmount ? `legacy_total=${totalAmount}` : null,
      row.hostedInvoiceUrl ? `hosted_invoice_url=${row.hostedInvoiceUrl}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      select: { id: true },
    });

    const data = {
      userId,
      stripeSubscriptionId,
      planName: buildSubscriptionPlanName(row, months),
      status,
      amount: recurringAmount || 0,
      currency: "USD",
      interval: "month",
      intervalCount: 1,
      startDate,
      nextBillingDate,
      endDate,
      cancelAtPeriodEnd: !!row.cancelAtPeriodEnd,
      notes,
      createdAt: startDate,
    };

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          ...data,
          createdAt: undefined,
        },
      });
      stats.updated += 1;
    } else {
      await prisma.subscription.create({ data });
      stats.created += 1;
    }
  }

  return stats;
}

function buildAddressKey(userId, address) {
  return [
    userId,
    address.line1,
    address.line2 || "",
    address.city,
    address.state,
    address.zip,
    address.country || "US",
  ].join("|");
}

async function ensureAddress(userId, candidate, cache) {
  const normalized = normalizeDefaultAddress(candidate);
  if (!normalized) {
    return null;
  }

  const key = buildAddressKey(userId, normalized);
  if (cache.has(key)) {
    return cache.get(key);
  }

  const existing = await prisma.address.findFirst({
    where: {
      userId,
      line1: normalized.line1,
      line2: normalized.line2 || null,
      city: normalized.city,
      state: normalized.state,
      zip: normalized.zip,
      country: normalized.country,
    },
    select: { id: true },
  });

  if (existing) {
    cache.set(key, existing.id);
    return existing.id;
  }

  const created = await prisma.address.create({
    data: {
      userId,
      line1: normalized.line1,
      line2: normalized.line2 || null,
      city: normalized.city,
      state: normalized.state,
      zip: normalized.zip,
      country: normalized.country,
      isDefault: false,
    },
    select: { id: true },
  });

  cache.set(key, created.id);
  return created.id;
}

function matchVariant(product, item) {
  if (!product?.variants?.length) {
    return null;
  }

  const normalizedPlanDuration = cleanLegacyText(item.planDuration || "")
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (normalizedPlanDuration) {
    const byDuration = product.variants.find((variant) =>
      cleanLegacyText(variant.name || "")
        .toLowerCase()
        .includes(normalizedPlanDuration.replace(" month", ""))
    );

    if (byDuration) {
      return byDuration.id;
    }
  }

  const byPrice = product.variants.find((variant) => {
    const candidatePrice = variant.salePrice ?? variant.price;
    const unitPrice = item.quantity > 0 ? item.lineTotal / item.quantity : item.lineTotal;
    return roundMoney(candidatePrice) === roundMoney(unitPrice);
  });

  return byPrice?.id || null;
}

async function importOrders(orders, orderMetaById, orderItemsById, orderAddressesById, userLookups) {
  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
  };

  const products = await prisma.product.findMany({
    where: { wcId: { not: null } },
    select: {
      id: true,
      wcId: true,
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
        },
      },
    },
  });

  const productByWcId = new Map(
    products
      .filter((product) => Number.isInteger(product.wcId))
      .map((product) => [product.wcId, product]),
  );
  const addressCache = new Map();

  for (const order of orders) {
    const userId =
      (order.customerId
        ? userLookups.wpUserIdToLocalUserId.get(order.customerId)
        : null) ||
      (order.billingEmail
        ? userLookups.localUsersByEmail.get(order.billingEmail)?.id
        : null) ||
      null;

    if (!userId) {
      stats.skipped += 1;
      continue;
    }

    const meta = orderMetaById.get(order.id) || {};
    const rawItems = orderItemsById.get(order.id) || [];
    const addresses = orderAddressesById.get(order.id) || {};
    const billingAddress = addresses.billing || null;
    const orderStatus = mapOrderStatus(order.status);
    const subtotal = roundMoney(Math.max(order.totalAmount - order.taxAmount, 0)) || 0;
    const notes = [
      `Imported from WooCommerce order #${order.id}`,
      meta._healsend_medication ? `medication=${meta._healsend_medication}` : null,
      meta._healsend_duration ? `duration=${meta._healsend_duration}` : null,
      meta._healsend_plan_slug ? `plan_slug=${meta._healsend_plan_slug}` : null,
      meta.hld_ghl_contact_id ? `ghl_contact_id=${meta.hld_ghl_contact_id}` : null,
      meta._stripe_subscription_id
        ? `stripe_subscription_id=${meta._stripe_subscription_id}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const addressId = await ensureAddress(
      userId,
      {
        line1: billingAddress?.line1,
        line2: billingAddress?.line2,
        city: billingAddress?.city,
        state: billingAddress?.state,
        zip: billingAddress?.zip,
        country: billingAddress?.country || "US",
      },
      addressCache,
    );

    const itemInputs = rawItems.map((item) => {
      const product = item.wcProductId ? productByWcId.get(item.wcProductId) : null;
      const unitPrice =
        item.quantity > 0 ? roundMoney(item.lineTotal / item.quantity) : roundMoney(item.lineTotal);

      return {
        productId: product?.id || null,
        variantId: matchVariant(product, item),
        name: item.name,
        price: unitPrice || 0,
        quantity: item.quantity || 1,
        metadata: {
          importedFrom: "wordpress_woocommerce",
          wcOrderItemId: item.orderItemId,
          wcProductId: item.wcProductId,
          wcVariationId: item.wcVariationId,
          planDuration: item.planDuration || meta._healsend_duration || null,
          healsendMedication: meta._healsend_medication || null,
          healsendPlanSlug: meta._healsend_plan_slug || null,
          stripeSubscriptionId: meta._stripe_subscription_id || null,
        },
      };
    });

    const existing = await prisma.order.findUnique({
      where: { orderNumber: String(order.id) },
      select: { id: true },
    });

    const data = {
      orderNumber: String(order.id),
      userId,
      status: orderStatus,
      subtotal,
      tax: roundMoney(order.taxAmount) || 0,
      shipping: 0,
      discount: 0,
      total: roundMoney(order.totalAmount) || 0,
      stripePaymentId: order.transactionId || null,
      stripePaymentStatus: mapStripePaymentStatus(orderStatus),
      stripePaymentMethod:
        meta._payment_method || order.paymentMethod || null,
      paymentCapturedAt:
        orderStatus === "PROCESSING" || orderStatus === "DELIVERED"
          ? order.createdAt || null
          : null,
      addressId,
      notes,
      createdAt: order.createdAt || undefined,
    };

    if (existing) {
      await prisma.order.update({
        where: { id: existing.id },
        data: {
          ...data,
          createdAt: undefined,
          items: {
            deleteMany: {},
            create: itemInputs,
          },
        },
      });
      stats.updated += 1;
    } else {
      await prisma.order.create({
        data: {
          ...data,
          items: {
            create: itemInputs,
          },
        },
      });
      stats.created += 1;
    }
  }

  return stats;
}

async function main() {
  assertImportConfig();

  console.log(`Loading WordPress account data${dryRun ? " (dry run)" : ""}...`);

  const wordpressUsers = loadWordPressUsers();
  const patients = loadPatients();
  const subscriptions = loadSubscriptions();
  const payments = loadPayments();
  const orders = loadWcOrders();
  const orderMetaById = loadWcOrderMeta();
  const orderAddressesById = loadWcOrderAddresses();
  const orderItemsById = loadWcOrderItems();
  const userSeeds = buildUserSeeds(wordpressUsers, patients, subscriptions);

  console.log(
    JSON.stringify(
      {
        wordpressUsers: wordpressUsers.length,
        patients: patients.length,
        subscriptions: subscriptions.length,
        subscriptionsEligible: subscriptions.filter(shouldImportSubscription).length,
        subscriptionsFilteredBnpl:
          subscriptions.length - subscriptions.filter(shouldImportSubscription).length,
        payments: payments.length,
        orders: orders.length,
        orderItems: [...orderItemsById.values()].reduce(
          (sum, items) => sum + items.length,
          0,
        ),
        userSeeds: userSeeds.length,
      },
      null,
      2,
    ),
  );

  if (dryRun) {
    return;
  }

  const userLookups = await upsertUsers(userSeeds);
  const paymentStats = await importPaymentMethods(payments, userLookups);
  const subscriptionStats = await importSubscriptions(subscriptions, userLookups);
  const orderStats = await importOrders(
    orders,
    orderMetaById,
    orderItemsById,
    orderAddressesById,
    userLookups,
  );

  console.log(
    JSON.stringify(
      {
        users: userLookups.stats,
        payments: paymentStats,
        subscriptions: subscriptionStats,
        orders: orderStats,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
