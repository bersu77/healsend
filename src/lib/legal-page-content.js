/**
 * Static content for all legal pages
 * Used by each legal page's static route (src/app/[slug]/page.jsx)
 */

export const LEGAL_PAGE_DATA = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How Healsend collects, uses, and protects your personal and health information.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "pp-intro",
        title: "1. Introduction & Roles",
        summary: null,
        html: `<p><strong>Effective Date: October 5, 2025</strong></p>
<p>Healsend Inc. ("Healsend," "we," "us," "our") operates as a Management Services Organization (MSO). We provide technology infrastructure, administrative services, billing coordination, and platform management to a network of licensed independent Professional Entities — physician groups, professional corporations, and other licensed healthcare providers — that independently deliver clinical care to patients through the Platform.</p>
<p><strong>We are a technology and administrative services company, not a medical provider.</strong> Healsend does not practice medicine, does not diagnose or treat patients, does not employ licensed clinicians in a clinical capacity, and does not function as a covered entity under HIPAA with respect to its own platform operations. The Professional Entities we support are independent licensed entities that may be covered entities or business associates under HIPAA, and Healsend serves as a Business Associate under those arrangements.</p>
<p>This Privacy Policy applies to all information collected through healsend.com and all associated applications, platforms, portals, and services (collectively, the "Platform"). Our mailing address is 30 N Gould St Ste R, Sheridan WY 82801. Contact: <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> | <a href="https://healsend.com">https://healsend.com</a>.</p>`,
      },
      {
        id: "pp-scope",
        title: "2. Scope; U.S.-Only Audience",
        summary: null,
        html: `<p>This Policy applies to all individuals who: visit or interact with healsend.com or the Platform; create an account or register as a patient; complete health intake questionnaires or consultations; purchase or use any service through the Platform; or contact us for support or information.</p>
<p>This Policy does <strong>not</strong> apply to information processed exclusively by Professional Entities in their capacity as independent covered entities. Patients seeking access to their Protected Health Information (PHI) held by a treating Professional Entity should contact that entity directly or submit a HIPAA request to Healsend's Privacy Officer (see Section 28).</p>
<p><strong>Our Platform and services are available only to residents of the United States who are 18 years of age or older.</strong> We do not knowingly market to or process information of non-U.S. residents or individuals under 18.</p>`,
      },
      {
        id: "pp-definitions",
        title: "3. Key Definitions",
        summary: null,
        html: `<ul>
<li><strong>Personal Information (PI):</strong> Any information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked to a particular individual or household.</li>
<li><strong>Consumer Health Data (CHD):</strong> Personal information that identifies your past, present, or future physical or mental health condition, including health history, diagnoses, medications, treatment, and related data. Where collected outside a HIPAA business associate context, CHD is regulated under state consumer health data laws such as Washington's My Health My Data Act (MHMDA) and Nevada SB 370.</li>
<li><strong>Sensitive Personal Information (SPI):</strong> A subset of PI that includes: Social Security Number or government ID; precise geolocation; racial or ethnic origin; religious beliefs; union membership; content of personal communications; genetic or biometric data; health information; sexual orientation or gender identity; and financial account credentials. SPI receives the highest level of protection under this Policy.</li>
<li><strong>Protected Health Information (PHI):</strong> Individually identifiable health information created, received, maintained, or transmitted by a HIPAA-covered entity or Business Associate that relates to health condition, provision of care, or payment.</li>
<li><strong>Professional Entity:</strong> Independent licensed physician groups, professional corporations, PLLCs, and other licensed healthcare providers that contract with Healsend's MSO and independently deliver clinical care to patients.</li>
<li><strong>Service Provider / Business Associate:</strong> Third parties that process data on behalf of Healsend or Professional Entities under Data Processing Agreements (DPAs) or Business Associate Agreements (BAAs) that contractually limit their use of data.</li>
</ul>`,
      },
      {
        id: "pp-data-collection",
        title: "4. Categories of Personal Information Collected",
        summary: null,
        html: `<p>We collect the following categories of personal information depending on how you interact with the Platform:</p>
<h3>Identifiers &amp; Contact Information</h3>
<ul>
<li>Name, email, phone, mailing address, date of birth</li>
<li>Username and account credentials (passwords stored as salted hashes; we never store plaintext passwords)</li>
<li>IP address, device identifier, session tokens, browser fingerprint</li>
</ul>
<h3>Health &amp; Clinical Intake</h3>
<ul>
<li>Responses to health intake questionnaires (symptoms, medical history, medications, allergies, surgical history, family history)</li>
<li>Consultation notes, clinical determinations, and treatment preferences</li>
<li>Lab results, imaging reports, or medical records you upload or authorize providers to share</li>
<li>Weight, height, BMI, body measurements, and self-reported biometric data</li>
</ul>
<h3>Financial &amp; Transaction</h3>
<ul>
<li>Payment card details (processed by PCI-DSS-compliant third-party processors; we store only payment tokens)</li>
<li>Billing address, transaction history, subscription status</li>
</ul>
<h3>Internet &amp; Network Activity</h3>
<ul>
<li>Browser type, operating system, referring URLs</li>
<li>Pages visited, features used, time on Platform, click patterns, search queries within Platform</li>
<li>Cookie identifiers and tracking pixel data (see Section 12)</li>
</ul>
<h3>Geolocation</h3>
<ul>
<li>State and ZIP code (required for provider licensing compliance); city-level IP-inferred location</li>
</ul>
<h3>Communications</h3>
<ul>
<li>Messages you send to support, providers, or through Platform messaging</li>
<li>Survey responses, feedback submissions, and call recordings (where disclosed)</li>
</ul>
<h3>Images &amp; Media</h3>
<ul>
<li>Profile photos or identification images uploaded for identity verification</li>
<li>Clinical photos uploaded at provider request (e.g., skin condition images)</li>
</ul>
<h3>Inferences</h3>
<ul>
<li>Treatment eligibility inferences drawn from intake data</li>
<li>Risk or wellness scores derived from self-reported health information (used only for platform routing, not for denial of care)</li>
</ul>
<h3>Biometric (where collected)</h3>
<ul>
<li>Face geometry for identity verification (where applicable; subject to state biometric law disclosures — see Section 10)</li>
</ul>`,
      },
      {
        id: "pp-purposes",
        title: "5. Sources of Personal Information",
        summary: null,
        html: `<p>We collect personal information from the following sources:</p>
<ul>
<li><strong>Directly from you:</strong> Account registration, health intake forms, consultations, payment, support contacts, survey responses, and profile updates.</li>
<li><strong>Automatically:</strong> Cookies, pixels, server logs, analytics SDKs, and similar technologies when you interact with the Platform (see Section 12).</li>
<li><strong>From Professional Entities &amp; Pharmacies:</strong> Clinical determinations, prescription confirmations, dispensing records, lab results, and treatment notes created during the care delivery process.</li>
<li><strong>From Payment Processors:</strong> Transaction status, fraud signals, and tokenized payment information.</li>
<li><strong>From Public Sources:</strong> Publicly available directories or records used to verify licensure or validate contact information.</li>
</ul>`,
      },
      {
        id: "pp-processing-purposes",
        title: "6. Purposes of Processing",
        summary: null,
        html: `<ul>
<li><strong>Account Creation &amp; Authentication:</strong> Creating and maintaining your account, verifying identity, and securing access.</li>
<li><strong>Telehealth Facilitation:</strong> Routing intake data to the appropriate Professional Entity, enabling asynchronous or synchronous consultations, and coordinating care pathways.</li>
<li><strong>Prescription &amp; Pharmacy Coordination:</strong> Transmitting prescriptions to partner pharmacies (including compounding pharmacies) and tracking order/shipment status.</li>
<li><strong>Payment Processing:</strong> Billing subscription and one-time fees, managing refunds and payment disputes.</li>
<li><strong>Customer Support:</strong> Responding to inquiries and resolving issues.</li>
<li><strong>Fraud Prevention &amp; Security:</strong> Detecting unauthorized access, fraudulent transactions, and malicious activity.</li>
<li><strong>Analytics &amp; Platform Improvement:</strong> Understanding usage patterns, debugging technical issues, and testing new features using de-identified or aggregated data wherever possible.</li>
<li><strong>Legal Compliance &amp; Regulatory Obligations:</strong> Fulfilling recordkeeping, reporting, and response obligations under applicable law.</li>
<li><strong>Internal Audits:</strong> Records of consent, privacy requests, and processing activities for legal defensibility.</li>
<li><strong>Consent-Based Purposes:</strong> Marketing, research, or personalization activities performed only where you have given separate explicit consent.</li>
</ul>`,
      },
      {
        id: "pp-disclosures",
        title: "7. Our Role as MSO/Technology Provider; Provider Role",
        summary: null,
        html: `<p>Healsend acts as a Management Services Organization and technology platform. We do not practice medicine, diagnose conditions, or write prescriptions. All clinical care, diagnoses, prescriptions, and treatment decisions are made exclusively by the independent licensed Professional Entities and their associated providers.</p>
<p>Professional Entities are solely responsible for the clinical quality of care they deliver and for compliance with their own HIPAA obligations, state medical licensing laws, and professional conduct standards. Healsend is not liable for clinical decisions made by Professional Entities.</p>
<p>Healsend's administrative role includes: platform hosting, patient intake routing, secure messaging infrastructure, billing coordination, customer support, and logistics facilitation. None of these administrative functions constitute the practice of medicine.</p>`,
      },
      {
        id: "pp-hipaa",
        title: "8. HIPAA/HITECH Boundary; Business Associate Arrangements",
        summary: null,
        html: `<p>Where a Professional Entity is a HIPAA-covered entity, Healsend serves as a Business Associate (BA) under 45 CFR §160.103 and §164.502(e). In that capacity, Healsend signs a Business Associate Agreement (BAA) with each Professional Entity before receiving, creating, or transmitting any Protected Health Information (PHI) on the Professional Entity's behalf.</p>
<p>PHI processed under a BAA is governed by HIPAA's Privacy and Security Rules and HITECH's breach notification provisions. Healsend implements the safeguards required by 45 CFR §164.308 (administrative), §164.310 (physical), and §164.312 (technical).</p>
<p>For personal information Healsend manages outside a BAA context — such as data collected from Platform visitors, prospective patients, or non-clinical account management — this Privacy Policy and applicable state consumer privacy laws govern.</p>`,
      },
      {
        id: "pp-consumer-health",
        title: "9. Consumer Health Data (WA MHMDA; NV SB370)",
        summary: null,
        html: `<p>Where we collect or process Consumer Health Data (CHD) outside of a HIPAA BAA context (e.g., data collected from Platform interactions or health intake forms before a clinical relationship is established), we comply with the Washington My Health My Data Act (RCW 19.373) and Nevada SB 370 (NRS 603A), as applicable.</p>
<p>We obtain separate, explicit consent before collecting CHD for purposes beyond direct care delivery. We do not sell CHD. Washington residents may request a list of all third parties with whom their CHD has been shared. See our <a href="/consumer-health-data">Consumer Health Data Policy</a> for full details.</p>`,
      },
      {
        id: "pp-biometric",
        title: "10. Biometric &amp; Sensor Data",
        summary: null,
        html: `<p>Where Healsend collects biometric identifiers or biometric information (as defined by Illinois BIPA (740 ILCS 14), Texas Capture or Use of Biometric Identifier Act (Tex. Bus. &amp; Com. Code §503.001), or Washington RCW 19.375), Healsend: (a) provides a written policy governing retention and destruction; (b) obtains informed written consent before collection; (c) does not sell or profit from biometric data; and (d) destroys biometric data within 3 years of collection or within 1 year of your last interaction, whichever is earlier. Illinois residents may request biometric deletion within 30 days.</p>`,
      },
      {
        id: "pp-sensitive-pi",
        title: "11. Sensitive Personal Information",
        summary: null,
        html: `<p>We use and disclose Sensitive Personal Information (SPI) only for the following purposes: (a) providing the services you requested; (b) preventing and detecting fraud and security incidents; (c) ensuring safety of persons or property; (d) short-term transient use that does not include building profiles or altering experiences; (e) performing services for us (e.g., maintaining accounts, providing customer service); (f) verifying quality or safety of our services; and (g) as required by law.</p>
<p>We do not use SPI to infer characteristics about you unrelated to the telehealth services you requested. California residents may exercise the right to limit use of SPI at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "pp-cookies",
        title: "12. Cookies, Tracking, and Global Privacy Control (GPC)",
        summary: null,
        html: `<p>We use the following categories of cookies and tracking technologies (see Appendix F for full details):</p>
<ul>
<li><strong>Strictly Necessary:</strong> Session management, authentication, security tokens — cannot be disabled.</li>
<li><strong>Functional:</strong> Language preferences, saved form state — enabled by default, disable via browser settings.</li>
<li><strong>Analytics:</strong> Aggregate usage data to improve Platform performance — opt out via our cookie banner or browser.</li>
<li><strong>Advertising/Retargeting:</strong> Interest-based ads — opt out via cookie banner, NAI/DAA tools, or GPC signal.</li>
</ul>
<p>We honor Global Privacy Control (GPC) signals as opt-out requests for sale and sharing of personal information. You may also manage cookie preferences through our cookie consent manager or your browser's cookie settings.</p>`,
      },
      {
        id: "pp-targeted-ads",
        title: "13. Targeted Advertising, Analytics, and Opt-Outs",
        summary: null,
        html: `<p>We may use third-party advertising networks and analytics providers to deliver interest-based advertising and measure Platform performance. These services may set cookies or pixels that allow them to recognize your browser across sites.</p>
<p><strong>We do not sell your personal information</strong> for monetary consideration. Some data sharing with advertising partners for targeted advertising may constitute "sharing" under California law. You may opt out of this sharing by: (1) using our cookie consent manager; (2) sending a GPC signal; (3) contacting us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>; or (4) using the NAI opt-out tool at <a href="https://optout.networkadvertising.org" rel="noopener noreferrer">optout.networkadvertising.org</a>.</p>`,
      },
      {
        id: "pp-sharing",
        title:
          "14. Disclosures to Providers, Pharmacies, Service Providers, and Others",
        summary: null,
        html: `<p>We share personal information only in the following circumstances:</p>
<ul>
<li><strong>Professional Entities:</strong> Intake and health data is routed to the licensed provider group assigned to your case. The Professional Entity retains this data as PHI under their own HIPAA obligations.</li>
<li><strong>Pharmacies:</strong> Prescription details are transmitted to licensed compounding or retail pharmacies to fulfill authorized treatment plans.</li>
<li><strong>Service Providers:</strong> Third-party vendors (infrastructure, payment processing, identity verification, analytics, customer support, email/SMS delivery) operate under DPAs that restrict use to performing services on our behalf.</li>
<li><strong>Corporate Affiliates:</strong> We may share information with corporate affiliates subject to this Privacy Policy.</li>
<li><strong>Legal &amp; Regulatory Authorities:</strong> In response to valid legal process (subpoenas, court orders, regulatory requests), to prevent imminent harm, or to report suspected illegal activity.</li>
<li><strong>Business Transfers:</strong> In a merger, acquisition, or sale of assets, your information may be transferred to the successor entity subject to equivalent protections.</li>
</ul>
<p><strong>We do not sell personal information for monetary consideration. We do not share PHI for marketing purposes.</strong></p>`,
      },
      {
        id: "pp-retention",
        title: "15. Retention &amp; Disposal",
        summary: null,
        html: `<p>We retain personal information for as long as necessary to fulfill the purposes described in this Policy and our legal obligations. Our retention schedule (see Appendix B):</p>
<ul>
<li><strong>Account data &amp; identifiers:</strong> Account life + 7 years</li>
<li><strong>Health intake (non-PHI context):</strong> 7 years from last activity</li>
<li><strong>Payment tokens:</strong> 7 years from last transaction</li>
<li><strong>Server/application logs:</strong> 12–24 months (anonymized after)</li>
<li><strong>Privacy requests &amp; consent records:</strong> 24 months minimum</li>
</ul>
<p>Upon expiration of applicable retention periods, we securely delete, anonymize, or destroy personal information using industry-standard methods (NIST SP 800-88 media sanitization). You may request deletion of your personal information subject to legal retention obligations.</p>`,
      },
      {
        id: "pp-security",
        title: "16. Security Program",
        summary: null,
        html: `<p>We maintain a comprehensive information security program aligned with NIST Cybersecurity Framework and HIPAA Security Rule standards:</p>
<ul>
<li><strong>Administrative Safeguards:</strong> Privacy Officer and Security Officer roles; annual security training for all personnel; workforce access management; vendor risk assessments; incident response plan.</li>
<li><strong>Technical Safeguards:</strong> TLS 1.3 encryption in transit; AES-256 encryption at rest (FIPS 140-2 validated modules); multi-factor authentication (MFA) for administrative access; role-based access controls; continuous vulnerability scanning; annual third-party penetration testing; 12-month immutable audit logs.</li>
<li><strong>Physical Safeguards:</strong> Access-controlled facilities; certified media destruction; U.S.-based data centers with SOC 2 certifications.</li>
</ul>`,
      },
      {
        id: "pp-breach",
        title: "17. Incident Response &amp; Breach Notification",
        summary: null,
        html: `<p>In the event of a security incident affecting your personal information, we will:</p>
<ul>
<li>Notify affected individuals promptly and in compliance with applicable state breach notification laws</li>
<li>Notify HHS within 60 days of discovery for HIPAA breaches affecting 500 or more individuals</li>
<li>Notify the Washington Attorney General within 30 days for MHMDA breaches</li>
<li>Provide notification that includes: description of data involved, timeline of the incident, steps taken to mitigate, and recommended protective measures for affected individuals</li>
</ul>
<p>To report a suspected security incident, contact us immediately at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "pp-rights",
        title: "18. Patient/Consumer Privacy Rights",
        summary: null,
        html: `<p>Depending on your state of residence, you may have the following rights with respect to your personal information:</p>
<ul>
<li><strong>Right to Access/Know:</strong> Obtain a copy of, and information about, the personal information we hold about you.</li>
<li><strong>Right to Correct:</strong> Request correction of inaccurate personal information.</li>
<li><strong>Right to Delete:</strong> Request deletion of your personal information, subject to legal retention obligations.</li>
<li><strong>Right to Opt Out of Profiling:</strong> Opt out of profiling in furtherance of decisions that produce legal or similarly significant effects.</li>
<li><strong>Right to Appeal:</strong> If we deny your request, you may appeal to our Privacy Officer within 45 days of receiving our denial.</li>
</ul>
<p>To exercise these rights, submit a verifiable request to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> or write to 30 N Gould St Ste R, Sheridan WY 82801. We respond within 45 days (extendable by 45 days with written notice).</p>`,
      },
      {
        id: "pp-california",
        title: "19. California Privacy Rights (CCPA/CPRA)",
        summary: null,
        html: `<p>California residents have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):</p>
<ul>
<li><strong>Right to Know/Access:</strong> Request disclosure of the categories and specific pieces of personal information collected about you, sources, business purpose, and categories of third parties with whom we share information.</li>
<li><strong>Right to Delete:</strong> Request deletion of personal information we collected from you, subject to exceptions.</li>
<li><strong>Right to Correct:</strong> Request correction of inaccurate personal information.</li>
<li><strong>Right to Portability:</strong> Receive your personal information in a portable format.</li>
<li><strong>Right to Opt Out of Sale/Sharing:</strong> Opt out of the sale or sharing of personal information for cross-context behavioral advertising.</li>
<li><strong>Right to Limit Use of SPI:</strong> Limit Healsend's use and disclosure of Sensitive Personal Information to necessary purposes.</li>
<li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising CCPA rights.</li>
</ul>
<p>California residents may submit requests to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We verify identity before processing. For the 12 months preceding the date of this Policy, we did not knowingly sell or share the personal information of consumers under 16 years of age.</p>`,
      },
      {
        id: "pp-other-states",
        title: "20. Other State Privacy Rights",
        summary: null,
        html: `<p>Residents of the following states have rights to access, correct, delete, and port their personal data, as well as to opt out of targeted advertising, profiling, and sale of personal data, under their respective state privacy laws: Colorado (CPA), Connecticut (CTDPA), Delaware (DPDPA), Iowa (ICDPA), Montana (MCDPA), Nebraska (NDPA), New Hampshire (NHPA), New Jersey (NJDPA), Nevada (NPICICA/SB370), Oregon (OCPA), Texas (TDPSA), Utah (UCPA), Virginia (VCDPA).</p>
<p>To exercise these rights, contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. The strongest applicable consumer protection under any law in your state of residence will be applied to your request.</p>`,
      },
      {
        id: "pp-children",
        title: "21. Children's &amp; Minors' Privacy",
        summary: null,
        html: `<p>Our Platform is intended for individuals 18 years of age and older. We do not knowingly collect personal information from individuals under 18. If we discover that we have inadvertently collected information from someone under 18, we will promptly delete it. If you believe we may have inadvertently collected information from a minor, please contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "pp-marketing",
        title: "22. Marketing, SMS/Text, and Email Communications",
        summary: null,
        html: `<p>We send two categories of communications:</p>
<ul>
<li><strong>Transactional/Service Messages:</strong> Account confirmations, appointment notifications, prescription updates, billing statements. These are necessary for service delivery and do not require separate consent.</li>
<li><strong>Marketing Messages:</strong> Promotional offers, health tips, and new service announcements. These require your explicit opt-in consent and include an easy opt-out mechanism in every message.</li>
</ul>
<p>To opt out of marketing emails, click "Unsubscribe" in any marketing email. To opt out of marketing SMS, reply STOP to any marketing text message. We process opt-outs within 10 business days. Opting out of marketing will not affect transactional messages required to deliver your services.</p>`,
      },
      {
        id: "pp-financial",
        title: "23. Financial &amp; PCI Matters",
        summary: null,
        html: `<p>All payment processing is handled by PCI-DSS-compliant third-party payment processors. Healsend does not store full payment card numbers. We store only payment tokens provided by the processor. Your card data is transmitted directly to the processor over encrypted channels. For questions about a specific charge, contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "pp-controlled-substances",
        title: "24. Controlled Substances; 42 CFR Part 2",
        summary: null,
        html: `<p>Where applicable, information related to substance use disorder treatment is protected under 42 CFR Part 2 and is not disclosed without your separate written consent except in narrow circumstances permitted by law (e.g., medical emergency). Prescriptions for controlled substances may have additional recordkeeping requirements under the Drug Enforcement Administration (DEA) and applicable state pharmacy laws.</p>`,
      },
      {
        id: "pp-accessibility",
        title: "25. Accessibility &amp; Non-Discrimination",
        summary: null,
        html: `<p>We are committed to making this Privacy Policy accessible. If you need this Policy in an alternative format due to a disability, please contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We comply with the Americans with Disabilities Act (ADA) and Section 508 of the Rehabilitation Act with respect to our Platform's accessibility. We will not discriminate against you based on a protected characteristic in how we process your personal information.</p>`,
      },
      {
        id: "pp-ai",
        title: "26. Automated Decision-Making &amp; AI Use",
        summary: null,
        html: `<p>Healsend may use automated algorithms to: route intake forms to appropriate provider queues; detect potential fraud or account anomalies; and suggest relevant Platform content. These automated processes do not make final clinical determinations, diagnoses, or treatment decisions — all such decisions are made by licensed Providers. We do not use automated profiling to deny access to medical care or services based on protected characteristics.</p>`,
      },
      {
        id: "pp-telehealth-data",
        title: '27. Telehealth "Store and Forward"; Cross-Entity Data Flows',
        summary: null,
        html: `<p>Our primary telehealth modality is asynchronous "store and forward" — you submit intake data through the Platform, it is stored on our secure servers, and then forwarded to a licensed Provider for review. This means your health information may reside in Healsend's systems before being reviewed by a Provider. This data flow is governed by our BAA with the Professional Entity and by this Privacy Policy.</p>
<p>Where multiple Professional Entities or pharmacies are involved in your care (e.g., a prescribing provider and a compounding pharmacy), data is shared between them only to the extent necessary for your treatment. Each entity is contractually bound to protect your information under BAAs or DPAs.</p>`,
      },
      {
        id: "pp-dsr",
        title: "28. Data Subject Request Process &amp; Verification",
        summary: null,
        html: `<p>To exercise any privacy right described in this Policy:</p>
<ol>
<li>Submit a request to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> with subject line "Privacy Request."</li>
<li>We will acknowledge your request within 10 business days.</li>
<li>We will verify your identity before processing (typically by confirming your account email and one additional identifier).</li>
<li>We will respond within 45 days. Complex requests may be extended by an additional 45 days with written notice.</li>
<li>If you are dissatisfied with our response, you may appeal by replying to our response email within 30 days.</li>
</ol>
<p>We do not charge a fee for the first request in any 12-month period. Subsequent requests may incur a reasonable fee to cover costs of compliance.</p>`,
      },
      {
        id: "pp-changes",
        title: "29. Changes to This Policy",
        summary: null,
        html: `<p>We may update this Policy from time to time. We will post a revised version with a new effective date. Material changes will be communicated via a prominent notice on the Platform homepage and, where required by law, by direct email notification. Continued use of the Platform after the effective date of any revision constitutes your acceptance of the revised Policy. We maintain a 7-year archive of prior policy versions available upon request.</p>`,
      },
      {
        id: "pp-contact",
        title: "30. Contact Information",
        summary: null,
        html: `<p>To exercise privacy rights, ask questions, file a complaint, or request an alternative-format copy of this Policy:</p>
<ul>
<li><strong>Privacy Officer</strong><br>Healsend Inc.<br>30 N Gould St Ste R<br>Sheridan, WY 82801</li>
<li><strong>Email:</strong> <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></li>
</ul>
<p>We acknowledge requests within 5 business days and provide a substantive response within the statutory timeframe applicable to your state (generally 45 days).</p>
<p><strong>Appendix A — Data Inventory &amp; Categories:</strong> Available upon request.</p>
<p><strong>Appendix B — Retention Schedule:</strong> Account + IDs: account life +7 yr; Health intake non-PHI: 7 yr; Payment tokens: 7 yr; Logs: 12–24 mo; Privacy requests: 24 mo.</p>
<p><strong>Appendix C — State Privacy Rights Summary:</strong> Access/Know • Correct • Delete • Portability • Opt-Out Targeted Ads • Appeal — rights honored for all applicable states listed in Sections 19–20.</p>
<p><strong>Appendix D — Incident Response &amp; Notification Workflow:</strong> Available upon request.</p>
<p><strong>Appendix E — Service Provider/Subprocessor Standards:</strong> All service providers processing personal information on our behalf are subject to DPAs requiring NIST SP 800-53 security safeguards and HIPAA-equivalent protections where applicable.</p>
<p><strong>Appendix F — Cookies &amp; Tracking Technologies:</strong> Strictly Necessary (session/auth) | Functional (preferences) | Analytics (13 mo) | Advertising/Retargeting (opt-out via cookie banner or GPC).</p>`,
      },
    ],
  },

  "consent-to-telehealth-2": {
    slug: "consent-to-telehealth-2",
    title: "Consent to Telehealth",
    description:
      "Your rights and acknowledgments regarding telehealth services delivered through the Healsend platform.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "tele-purpose",
        title: "1. Purpose and Scope",
        summary: null,
        html: `<p><strong>Effective Date: October 5, 2025</strong></p>
<p>This Comprehensive Consent to Telehealth ("Consent") is issued by Healsend Inc. ("Healsend"), a Management Services Organization (MSO). Healsend does not practice medicine, does not provide medical advice, and is not a covered entity under HIPAA in its own right. All clinical care is delivered by independent, state-licensed Professional Entities and their associated Providers.</p>
<p>This Consent applies to all telehealth services facilitated through the Healsend Platform and supplements our <a href="/privacy-policy">Privacy Policy</a>, <a href="/consumer-health-data">Consumer Health Data Policy</a>, and <a href="/terms-of-service-2">Terms of Service</a>. By creating an account, completing intake, or scheduling a consultation, you acknowledge reading and agreeing to this Consent.</p>`,
      },
      {
        id: "tele-nature",
        title: "2. Nature of Telehealth",
        summary: null,
        html: `<p>Telehealth involves the delivery of healthcare services using telecommunications technology. Through the Healsend Platform, services may be delivered via:</p>
<ul>
<li><strong>Asynchronous (Store-and-Forward):</strong> You complete a health intake questionnaire; a licensed provider reviews your responses and issues a clinical determination without a real-time interaction.</li>
<li><strong>Messaging:</strong> Text-based communication between you and your care team through secure Platform messaging.</li>
<li><strong>Synchronous Video:</strong> Live video consultations where available.</li>
<li><strong>Remote Monitoring:</strong> Collection and transmission of health data you enter (e.g., weight, glucose readings) to support ongoing care.</li>
</ul>
<p>Not all modalities are available in all states or for all treatment types. Your provider will inform you of the modality used for your consultation.</p>`,
      },
      {
        id: "tele-parties",
        title: "3. Parties to This Consent",
        summary: null,
        html: `<ul>
<li><strong>Patient / You:</strong> The individual enrolling for telehealth services through the Platform.</li>
<li><strong>Provider:</strong> The individual licensed clinician (physician, PA, NP, or other) assigned to review your case and make clinical determinations.</li>
<li><strong>Professional Entity:</strong> The licensed healthcare group (PC, PA, PLLC) through which the Provider is affiliated and that employs or contracts with the Provider.</li>
<li><strong>Healsend:</strong> The MSO providing technology, administrative support, and platform infrastructure. Healsend is not a party to the patient-provider clinical relationship.</li>
</ul>`,
      },
      {
        id: "tele-benefits-risks",
        title: "4. Benefits, Limitations, and Risks of Telehealth",
        summary: null,
        html: `<h3>Benefits</h3>
<ul>
<li>Expanded access to licensed healthcare without geographic barriers</li>
<li>Shorter wait times compared to traditional in-person visits</li>
<li>Lower costs and no travel requirements</li>
<li>Secure follow-up communication with your care team</li>
<li>Ongoing monitoring for chronic condition management</li>
</ul>
<h3>Limitations</h3>
<ul>
<li>Telehealth cannot replace an in-person physical examination; some conditions require in-person evaluation</li>
<li>Not all medical conditions are appropriate for telehealth assessment; your Provider may require in-person care</li>
<li>Technical interruptions (internet outages, device failures) may delay consultations</li>
<li>Certain diagnostic tools (imaging, blood draws, physical labs) are not available through the Platform</li>
</ul>
<h3>Risks</h3>
<ul>
<li>Incomplete medical information may affect clinical decision-making</li>
<li>Transmission errors or platform failures could delay treatment</li>
<li>Electronic transmission of health data involves inherent security risks, which we mitigate through our security program</li>
</ul>
<p>By proceeding, you acknowledge this information and confirm that telehealth is an acceptable modality for your current healthcare needs. You retain the right to seek in-person care at any time.</p>`,
      },
      {
        id: "tele-representations",
        title: "5. Patient Representations; Provider Responsibilities",
        summary: null,
        html: `<h3>Patient Representations</h3>
<p>By using the Platform and requesting a consultation, you represent that you:</p>
<ul>
<li>Are at least 18 years old and located in a U.S. state where the applicable Professional Entity's Providers are licensed</li>
<li>Will provide complete, accurate, and truthful responses to all health intake questions; you understand that clinical decisions depend on this accuracy</li>
<li>Are not using this Platform as a substitute for emergency care</li>
<li>Will not record consultations without the explicit written consent of all parties</li>
<li>Will comply with your Provider's instructions, follow-up recommendations, and safety guidance</li>
</ul>
<h3>Provider Responsibilities</h3>
<p>Your assigned licensed Provider will:</p>
<ul>
<li>Maintain active professional licensure in your state of residence</li>
<li>Carry malpractice insurance in amounts required by applicable professional standards</li>
<li>Review your intake information before making any clinical determination</li>
<li>Maintain clinical records in an EHR system in compliance with HIPAA and state medical recordkeeping requirements</li>
<li>Provide referrals to in-person or emergency care when clinically appropriate</li>
<li>Have the discretion to decline to prescribe or treat if telehealth is not clinically suitable for your situation</li>
</ul>`,
      },
      {
        id: "tele-pharmacy",
        title: "6. Pharmacy, Laboratory, and Third-Party Coordination",
        summary: null,
        html: `<p>Healsend facilitates electronic transmission of prescriptions and lab orders to licensed third-party pharmacies and laboratories chosen by you or your Provider. Healsend does not own, operate, or control any pharmacy or laboratory, does not compound or manufacture medications, and does not make pharmacy pricing decisions.</p>
<p>You may request copies of your prescription records and lab results at any time by contacting <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. Pharmacies and laboratories are independent entities responsible for their own compliance with applicable licensure, quality, and safety requirements.</p>`,
      },
      {
        id: "tele-privacy",
        title: "7. Privacy and Security",
        summary: null,
        html: `<p>Your health information is protected under our <a href="/privacy-policy">Privacy Policy</a> and <a href="/consumer-health-data">Consumer Health Data Policy</a>. Where the Professional Entity is a HIPAA-covered entity, PHI is governed by HIPAA Privacy and Security Rules and the applicable Business Associate Agreement.</p>
<ul>
<li><strong>In Transit:</strong> All Platform communications use TLS 1.3 encryption.</li>
<li><strong>At Rest:</strong> Health data is encrypted using AES-256 FIPS 140-2 validated modules.</li>
<li><strong>Access Controls:</strong> Data access is limited to your treating Provider, authorized care team members, and administrative staff on a strict need-to-know basis.</li>
</ul>
<p>Your health information collected through the Platform is used only for: treatment and care coordination; billing and payment; legal and regulatory compliance; and de-identified platform improvement (with all direct identifiers removed). We do not sell your health information.</p>`,
      },
      {
        id: "tele-patient-rights",
        title: "8. Patient Rights",
        summary: null,
        html: `<p>You have the following rights in connection with telehealth services:</p>
<ul>
<li>To be treated with respect and dignity at all times</li>
<li>To receive clear explanations of your diagnosis, treatment options, and expected outcomes in plain language</li>
<li>To ask questions and seek a second opinion before accepting any treatment</li>
<li>To access your medical records and request copies in compliance with applicable law</li>
<li>To revoke this Consent at any time (see Section 16)</li>
<li>To file a complaint without fear of retaliation (see Section 9)</li>
</ul>`,
      },
      {
        id: "tele-complaints",
        title: "9. Complaints and Grievances",
        summary: null,
        html: `<p>You may file a complaint or grievance through the following channels without fear of retaliation:</p>
<ul>
<li><strong>Clinical Complaints (quality of care, Provider conduct):</strong> Contact the Professional Entity directly or write to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> with subject line "Clinical Complaint." We will route your complaint to the appropriate Professional Entity.</li>
<li><strong>Technical or Administrative Complaints (Platform issues, billing, data handling):</strong> Email <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We respond within 5 business days.</li>
<li><strong>Serious Clinical Complaints:</strong> Contact your state medical board, nursing board, or pharmacy board, as applicable. HHS Office for Civil Rights for HIPAA concerns: <a href="https://www.hhs.gov/ocr" rel="noopener noreferrer">hhs.gov/ocr</a>.</li>
</ul>`,
      },
      {
        id: "tele-emergencies",
        title: "10. Emergencies",
        summary: null,
        html: `<p><strong>DO NOT USE THIS PLATFORM FOR MEDICAL EMERGENCIES.</strong> If you experience any of the following, call 911 or go to the nearest emergency room immediately:</p>
<ul>
<li>Chest pain or pressure</li>
<li>Shortness of breath or difficulty breathing</li>
<li>Severe or uncontrolled bleeding</li>
<li>Suicidal thoughts or intent to harm yourself or others</li>
<li>Sudden vision loss, severe headache, or signs of stroke</li>
</ul>
<p>The Platform is not monitored 24/7 for urgent clinical communications. In a life-threatening situation, always call 911 first.</p>`,
      },
      {
        id: "tele-retention",
        title: "11. Data Retention and Recordkeeping",
        summary: null,
        html: `<p>Your Provider and their Professional Entity maintain clinical records (including telehealth encounter notes and prescriptions) for a minimum of 7 years as required by federal and applicable state medical recordkeeping laws. Healsend retains platform data (intake forms, communications, transaction records) per our retention schedule described in our <a href="/privacy-policy">Privacy Policy</a>.</p>
<p>You may request copies of your platform records at any time by contacting <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tele-electronic-comms",
        title: "12. Consent to Electronic Communications",
        summary: null,
        html: `<p>By using the Platform, you consent to receive communications from Healsend and your Provider via email, SMS, and secure patient portal messages. These include: appointment notifications, prescription updates, billing statements, clinical instructions, and important safety alerts.</p>
<p>To withdraw consent to electronic communications or to change your communication preferences, email <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. Withdrawing consent may limit Platform functionality and require paper-based communication for certain records.</p>`,
      },
      {
        id: "tele-costs",
        title: "13. Acknowledgment of Potential Costs",
        summary: null,
        html: `<p>Services are offered on a self-pay basis. We do not bill insurance, Medicare, or Medicaid. You are responsible for all fees disclosed at the time of enrollment or purchase. Medication costs are determined independently by the dispensing pharmacy and are separate from Platform fees. Healsend does not control pharmacy pricing.</p>`,
      },
      {
        id: "tele-state",
        title: "14. Multi-State Legal Disclosures",
        summary: null,
        html: `<ul>
<li><strong>California (Bus. &amp; Prof. Code §2290.5):</strong> Providers must obtain consent to telehealth before each telehealth consultation. You have the right to receive an itemized statement of charges within 5 business days of request.</li>
<li><strong>Florida (F.S. §456.47):</strong> Providers using telehealth must inform patients of limitations and provide referrals to in-person care where clinically indicated.</li>
<li><strong>Texas (TMB Rule §174):</strong> A valid patient-provider relationship must be established before prescribing via telehealth. Providers comply with Texas Medical Board telehealth standards.</li>
<li><strong>Washington (RCW 70.41.230):</strong> Patients must renew informed consent to telehealth annually for ongoing treatment relationships.</li>
<li><strong>New York (Public Health Law §2999-cc):</strong> Telehealth records must be maintained for 6 years.</li>
<li><strong>Virginia &amp; Colorado:</strong> Patients have rights to access and correct their health records under state consumer data protection laws.</li>
<li><strong>Illinois (BIPA):</strong> Biometric data (if collected for verification) is subject to BIPA protections; see our <a href="/privacy-policy">Privacy Policy</a>.</li>
</ul>`,
      },
      {
        id: "tele-tech",
        title: "15. Technology Requirements and Security Warnings",
        summary: null,
        html: `<p>To use the Platform, you need a compatible device (smartphone, tablet, or computer) with an up-to-date browser or the Healsend mobile app, and a reliable internet connection. For video consultations, a working camera and microphone are required.</p>
<p><strong>Security Warnings:</strong> Do not use public or unsecured Wi-Fi networks for telehealth consultations. Do not share your login credentials. Healsend employs end-to-end encryption and multi-factor authentication to protect your sessions, but your security also depends on your device and network environment.</p>`,
      },
      {
        id: "tele-withdrawal",
        title: "16. Withdrawal of Consent",
        summary: null,
        html: `<p>You may withdraw this Consent at any time by providing written notice to Healsend at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> or directly to your Provider. Withdrawal stops future telehealth services but does not affect care already provided or prescriptions already dispensed. Outstanding prescription shipments may continue processing if already sent to the pharmacy before your withdrawal notice is received.</p>`,
      },
      {
        id: "tele-acknowledgment",
        title: "17. Acknowledgment and Signature",
        summary: null,
        html: `<p>By clicking "I Consent" or by creating an account, completing an intake form, or scheduling a consultation through the Healsend Platform, you acknowledge that:</p>
<ul>
<li>You have read and fully understand this Consent to Telehealth</li>
<li>You understand the benefits, risks, and limitations of telehealth services described herein</li>
<li>You voluntarily agree to receive healthcare services via telehealth through the Platform</li>
<li>You authorize licensed Providers affiliated with the Professional Entities to review your health information and provide clinical services</li>
<li>You agree to the <a href="/privacy-policy">Privacy Policy</a>, <a href="/consumer-health-data">Consumer Health Data Policy</a>, and <a href="/terms-of-service-2">Terms of Service</a></li>
<li>Your electronic acceptance constitutes a legally binding signature under the Electronic Signatures in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA)</li>
</ul>`,
      },
    ],
  },

  "consumer-health-data": {
    slug: "consumer-health-data",
    title: "Consumer Health Data Policy",
    description:
      "How Healsend collects, uses, and protects your consumer health data under state health privacy laws.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "chd-intro",
        title: "1. Purpose and Scope",
        summary: null,
        html: `<p><strong>Effective Date: October 5, 2025</strong></p>
<p>This Consumer Health Data &amp; Biometric Privacy Policy ("Policy") is issued by Healsend Inc. ("Healsend"), a Management Services Organization (MSO) and technology facilitator. Healsend is not a medical provider, does not practice medicine, and does not independently function as a HIPAA-covered entity. The Professional Entities supported by Healsend's Platform are independent licensed healthcare providers who may be covered entities or business associates under HIPAA.</p>
<p>This Policy covers Consumer Health Data (CHD) and biometric data collected and processed by Healsend in its capacity as a technology platform and data controller — separate from PHI processed by Professional Entities under their own Notices of Privacy Practices and HIPAA Business Associate Agreements. This Policy supplements our <a href="/privacy-policy">Master Privacy Policy</a>.</p>`,
      },
      {
        id: "chd-definitions",
        title: "2. Definitions",
        summary: null,
        html: `<ul>
<li><strong>Consumer Health Data (CHD):</strong> Personal information that identifies your past, present, or future physical or mental health status, including diagnoses, medications, health conditions, health-related payments, bodily functions, or characteristics regulated under WA MHMDA, NV SB370, or similar state laws.</li>
<li><strong>Biometric Data:</strong> Data generated from physiological or behavioral characteristics used for identification, including fingerprints, voiceprints, iris scans, retinal scans, face geometry, and gait patterns.</li>
<li><strong>Sensitive Health Data:</strong> A subset of CHD that includes reproductive and sexual health information, mental health status, substance use disorder information, and genetic data.</li>
<li><strong>Personal Information:</strong> Information that identifies, relates to, or could reasonably be linked to an individual or household.</li>
<li><strong>Professional Entity:</strong> Independent licensed physician groups, professional corporations, or PLLCs that use the Platform to deliver clinical care.</li>
<li><strong>Processing:</strong> Any operation performed on personal data, including collection, storage, use, disclosure, or deletion.</li>
<li><strong>Service Provider/Contractor:</strong> Entities that process data on Healsend's behalf under contracts restricting them to performing services for us.</li>
<li><strong>De-identified Data:</strong> Information from which all direct and reasonably linkable identifiers have been removed under HIPAA Expert Determination or Safe Harbor methods.</li>
<li><strong>Business Associate:</strong> Healsend, in its capacity as a BA under 45 CFR §160.103, when processing PHI on behalf of a covered Professional Entity under a signed BAA.</li>
<li><strong>Consumer Request:</strong> A verifiable request from you to exercise a privacy right listed in Section 8.</li>
</ul>`,
      },
      {
        id: "chd-law",
        title: "3. Applicability of Federal and State Law",
        summary: null,
        html: `<p><strong>Federal Laws:</strong> HIPAA/HITECH (where Healsend acts as a BA), FTC Act §5 (unfair/deceptive practices), 21 CFR Part 11 (electronic records), ESIGN/UETA (electronic signatures), COPPA (not applicable — Platform is 18+ only), FTC Health Breach Notification Rule (for non-HIPAA PHR-related entities).</p>
<p><strong>State Laws (stronger consumer protection prevails):</strong> California CCPA/CPRA; Washington MHMDA (RCW 19.373); Nevada SB370 (NRS 603A); Texas HB300 (Tex. H&amp;S Code §181); Illinois BIPA (740 ILCS 14); Colorado CPA; Connecticut CTDPA; Virginia VCDPA; Utah UCPA; Iowa ICDPA; Montana MCDPA.</p>
<p>Where multiple laws apply to the same data processing activity, we apply the standard that affords the strongest consumer protection.</p>`,
      },
      {
        id: "chd-collection",
        title: "4. Information We Collect",
        summary: null,
        html: `<h3>A. Directly from You</h3>
<ul>
<li>Identifiers: name, contact info, date of birth, government ID for identity verification</li>
<li>Medical intake: symptoms, diagnoses, medications, allergies, surgical history, biometric measurements</li>
<li>Payment: billing address, transaction records (card numbers processed by third-party processors only)</li>
<li>Support: messages, feedback, survey responses</li>
</ul>
<h3>B. From Professional Entities &amp; Pharmacies</h3>
<ul>
<li>Diagnosis codes, treatment plans, prescriptions, lab results, dispensing confirmations</li>
</ul>
<h3>C. Automatically</h3>
<ul>
<li>Device identifiers, IP address, cookie data, server logs, usage analytics</li>
</ul>
<h3>D. Biometric / Sensor Data</h3>
<ul>
<li>Facial geometry or voice patterns (where used for identity verification, with state-specific consent)</li>
<li>Wearable device data you authorize to connect to the Platform</li>
</ul>
<h3>E. Derived / Inferred</h3>
<ul>
<li>Treatment eligibility inferences, risk scores derived from intake data (used only for Platform routing, not for denial of medical care); de-identified aggregate data used for research and quality improvement</li>
</ul>
<p><strong>We do not knowingly collect information from individuals under 18.</strong></p>`,
      },
      {
        id: "chd-use",
        title: "5. How We Use Consumer Health and Biometric Data",
        summary: null,
        html: `<h3>5.1 Primary Uses (no additional consent required)</h3>
<ul>
<li>Platform operation: account management, authentication, technical support</li>
<li>Facilitating care delivery: routing intake to Professional Entities, care coordination</li>
<li>Payment processing and prescription/lab fulfillment</li>
<li>Analytics and platform improvement (using de-identified or aggregated data)</li>
<li>Support and communication: responding to inquiries and providing service updates</li>
<li>Regulatory compliance: recordkeeping, legal response, safety reporting</li>
<li>Security and fraud prevention</li>
</ul>
<h3>5.2 Secondary Uses (require your explicit consent)</h3>
<ul>
<li>We do <strong>not</strong> sell, lease, or trade CHD or biometric data</li>
<li>We do <strong>not</strong> use CHD for cross-context behavioral advertising</li>
<li>We do <strong>not</strong> use CHD to make employment, credit, or insurance decisions</li>
<li>We do <strong>not</strong> use automated health profiling to produce legally significant effects without your explicit, informed consent</li>
</ul>
<h3>5.3 Lawful Basis</h3>
<ul>
<li><strong>Service delivery:</strong> Contractual necessity (fulfilling our Terms of Service)</li>
<li><strong>Compliance:</strong> Legal obligation (HIPAA, state recordkeeping)</li>
<li><strong>Security:</strong> Legitimate interest in protecting the Platform and users</li>
<li><strong>Analytics:</strong> De-identified data — no legal basis required for purely de-identified processing</li>
<li><strong>Marketing &amp; secondary uses:</strong> Consent</li>
</ul>`,
      },
      {
        id: "chd-sharing",
        title: "6. When and Why We Share Data",
        summary: null,
        html: `<h3>6.1 Categories of Recipients</h3>
<ul>
<li><strong>Professional Entities &amp; Pharmacies:</strong> For care delivery and prescription fulfillment under BAAs or DPAs.</li>
<li><strong>Service Providers (Contractors):</strong> Cloud hosting, payment processing, identity verification, analytics, email/SMS delivery — all bound by contracts limiting use to services on our behalf.</li>
<li><strong>Corporate Affiliates &amp; Successors:</strong> In mergers or acquisitions, subject to equivalent privacy protections.</li>
<li><strong>Regulators &amp; Law Enforcement:</strong> In response to valid legal process, to prevent imminent harm, or as required by law.</li>
<li><strong>Authorized Agents:</strong> Individuals you have designated in writing to act on your behalf.</li>
</ul>
<h3>6.2 Safeguards for Vendors</h3>
<p>All vendors handling CHD or biometric data must sign DPAs or BAAs requiring NIST SP 800-53 safeguards. Vendors must notify us of security incidents within 72 hours.</p>
<h3>6.3 No Cross-Border Transfers</h3>
<p>We do not transfer your consumer health data outside the United States.</p>
<h3>6.4 No Sale of De-identified Data for Re-identification</h3>
<p>We share de-identified or aggregate data only, never for the purpose of re-identifying individuals.</p>`,
      },
      {
        id: "chd-retention",
        title: "7. Retention and Deletion of Data",
        summary: null,
        html: `<h3>7.1 Retention Schedule</h3>
<ul>
<li><strong>Account &amp; profile data:</strong> Until account closure</li>
<li><strong>Medical intake &amp; clinical records:</strong> 7 years from last activity (per federal/state medical recordkeeping requirements)</li>
<li><strong>Payment tokens:</strong> 7 years from last transaction (PCI compliance)</li>
<li><strong>Biometric identifiers:</strong> No longer than 30 days after verification is complete, or less if required by state law</li>
<li><strong>Security logs:</strong> 12 months (immutable; then anonymized)</li>
</ul>
<h3>7.2 Deletion Requests</h3>
<p>Submit deletion requests to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We verify your identity and complete verified deletion within 45 days. Backup copies are purged within 90 days. Certain data is retained to comply with legal obligations, resolve disputes, or prevent fraud.</p>
<h3>7.3 Annual Review</h3>
<p>We conduct an annual review of retained data and delete data that no longer serves a legitimate purpose.</p>`,
      },
      {
        id: "chd-rights",
        title: "8. Your Privacy Rights",
        summary: null,
        html: `<h3>8.1 Rights Available to You</h3>
<ul>
<li><strong>Access/Transparency (45 days):</strong> Obtain the categories and specific pieces of CHD we hold about you.</li>
<li><strong>Correction/Rectification (45 days):</strong> Request correction of inaccurate data.</li>
<li><strong>Deletion/Erasure:</strong> Request deletion of CHD, subject to legal retention obligations.</li>
<li><strong>Portability:</strong> Receive your CHD in a structured, machine-readable format (e.g., JSON or CSV).</li>
<li><strong>Restriction/Opt-Out:</strong> Opt out of secondary uses of your CHD, including any targeted advertising or profiling.</li>
<li><strong>Appeal (30 days):</strong> If we deny your request, you may appeal within 30 days of our response.</li>
</ul>
<h3>8.2 How to Submit a Request</h3>
<p>Email <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> with subject line "CHD Privacy Request," or write to: Healsend Inc., 30 N Gould St Ste R, Sheridan WY 82801.</p>
<h3>8.3 Fees</h3>
<p>We do not charge a fee for the first verified request within any 12-month period.</p>`,
      },
      {
        id: "chd-state",
        title: "9. State-Specific Disclosures",
        summary: null,
        html: `<h3>9.1 California (CCPA/CPRA)</h3>
<p>CHD constitutes Sensitive Personal Information (SPI) under CPRA. We limit SPI use to purposes listed in Section 5.1. California residents may request disclosure of all categories of CHD collected, opt out of any cross-context behavioral advertising, and request deletion of CHD. Contact: <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>
<h3>9.2 Washington (MHMDA — RCW 19.373)</h3>
<p>We obtain your explicit opt-in consent before collecting CHD for any purpose beyond direct care delivery. A consumer health data notice is included on our Platform homepage. Washington residents may withdraw consent within 30 days and request a list of all third parties with whom their CHD has been shared.</p>
<h3>9.3 Nevada (SB370 — NRS 603A)</h3>
<p>We do not sell Nevada residents' consumer health data. Nevada residents may request deletion of their CHD at any time.</p>
<h3>9.4 Texas (HB300 — Tex. H&amp;S Code §181)</h3>
<p>We provide annual privacy training to personnel who interact with Texas patients' health data and maintain training records for 6 years. Civil and criminal penalties may apply for violations.</p>
<h3>9.5 Illinois (BIPA — 740 ILCS 14)</h3>
<p>We obtain written/electronic informed consent before collecting any biometric identifier. We delete biometric data within 30 days of a verified deletion request. We do not sell or profit from biometric data.</p>
<h3>9.6 Colorado, Connecticut, Virginia, Utah, Iowa, Montana</h3>
<p>Residents of these states have access, correction, deletion, portability, and opt-out rights that we honor on a nationwide basis. Contact <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> to exercise these rights.</p>`,
      },
      {
        id: "chd-security",
        title: "10. Data Security and Incident Response",
        summary: null,
        html: `<h3>10.1 Administrative Safeguards</h3>
<p>Designated Privacy Officer and Security Officer; HIPAA and state privacy training for all personnel handling CHD; vendor management program with security certification requirements; least-privilege access policy.</p>
<h3>10.2 Technical Safeguards</h3>
<p>TLS 1.3 for all data in transit; AES-256 FIPS 140-2 at rest; MFA for administrative access; network segmentation; continuous automated vulnerability scanning; annual third-party penetration testing; 12-month immutable audit logs.</p>
<h3>10.3 Physical Safeguards</h3>
<p>Access-controlled facilities; cross-cut shredding for paper records; certified digital media wiping (NIST SP 800-88).</p>
<h3>10.4 Incident Response</h3>
<p>Upon discovery of a breach: (1) contain and assess; (2) notify affected individuals per 45 CFR §164.404 and applicable state laws; (3) conduct root cause analysis; (4) implement remediation. We maintain a documented incident response plan tested annually.</p>
<h3>10.5 Audit</h3>
<p>Annual internal HIPAA security audit; independent security assessment every 2 years; results shared with Covered Entity partners upon request.</p>`,
      },
      {
        id: "chd-contact",
        title: "11. Contact, Complaints, and Dispute Resolution",
        summary: null,
        html: `<h3>11.1 Privacy Office</h3>
<p>Healsend Inc.<br>30 N Gould St Ste R<br>Sheridan, WY 82801<br><a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>
<h3>11.2 Officers</h3>
<p>Healsend has designated a Privacy Officer and a Security Officer responsible for CHD compliance under this Policy.</p>
<h3>11.3 Complaint Process</h3>
<p>We acknowledge complaints within 10 business days and provide a substantive response within 30 days. If unresolved, you may escalate to the HHS Office for Civil Rights, the FTC, or your state Attorney General without retaliation.</p>
<h3>11.4 No Retaliation</h3>
<p>We will not retaliate against you for exercising your rights or filing a complaint.</p>
<h3>11.5 Governing Law</h3>
<p>Wyoming law governs this Policy. Disputes are subject to binding arbitration via AAA in Sheridan County, Wyoming, except that nothing in this Policy limits your right to file regulatory complaints with government authorities.</p>`,
      },
      {
        id: "chd-changes",
        title: "12. Changes to This Policy",
        summary: null,
        html: `<p>We review this Policy annually and update it as needed to reflect changes in applicable law, our data practices, or Platform functionality. Updated versions are posted with a new Effective Date. Material changes are announced on the Platform homepage and by email to affected users where required by law. We maintain a 7-year archive of prior policy versions. Continued use of the Platform after the effective date of a revised Policy constitutes your acceptance of the changes.</p>
<p><strong>Appendix A — Cookies:</strong> Essential (session/auth) | Analytics (13 mo) | Preference (12 mo) | Security Tokens (90 days rolling) | Platform honors GPC signals as opt-out.</p>
<p><strong>Appendix B — Data Classification:</strong> Tier 1 PHI (AES-256, BAA required) | Tier 2 CHD (NIST SP 800-53) | Tier 3 Operational Metadata (de-identified, 12 mo) | Tier 4 Public (review before posting).</p>
<p><strong>Appendix C — Record Retention:</strong> User accounts: until closed/secure erase | Medical encounters: 7 yr/encrypted purge | Payment: 7 yr/PCI deletion | Biometric: ≤30 days/auto wipe | Support tickets: 24 mo/purge | Audit logs: 12 mo/immutable.</p>
<p><strong>Appendix D — Regulatory References:</strong> HIPAA Privacy Rule 45 CFR Part 164 Subpart E | HIPAA Security Rule 45 CFR Part 164 Subpart C | FTC 16 CFR 318 | CA Civil Code §1798.100 | WA RCW 19.373 | IL 740 ILCS 14 | TX HB300 | NV NRS 603A | NIST CSF v1.1 | ISO 27001.</p>`,
      },
    ],
  },

  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    description:
      "Our commitment to fair refunds when medical treatments are unavailable or need to be changed.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "ref-intro",
        title: "1. Introduction",
        summary: null,
        html: `<p><strong>Last Updated: October 7, 2025</strong></p>
<p>Your treatment plan is subject to availability, clinical appropriateness, pharmacy supply, and applicable regulatory requirements. If a requested treatment becomes unavailable, your provider may recommend a clinically appropriate alternative or initiate a refund as described in this Policy.</p>`,
      },
      {
        id: "ref-unavailable",
        title: "2. Refunds for Unavailable Treatments",
        summary: null,
        html: `<p>If your provider determines that a requested treatment is clinically unavailable for you, you are entitled to a prorated refund based on the unshipped or unused portion of your plan at the listed monthly price, minus the cost of medications, consultations, and other services already provided.</p>`,
      },
      {
        id: "ref-alternative",
        title: "3. Switching to an Alternative Treatment",
        summary: null,
        html: `<p>Where clinically appropriate, your provider may recommend an alternative treatment at no additional cost for the remaining duration of your current plan, subject to provider approval. You are under no obligation to accept the alternative.</p>`,
      },
      {
        id: "ref-processing",
        title: "4. Refund Processing",
        summary: null,
        html: `<p>Approved refunds are issued to the original payment method and processed within 30 days of approval.</p>`,
      },
      {
        id: "ref-communications",
        title: "5. Member Communications",
        summary: null,
        html: `<p>By purchasing a plan, you agree to receive notifications regarding your plan via email and other electronic channels. You confirm that you have read and understood this Refund Policy.</p>`,
      },
      {
        id: "ref-contact",
        title: "6. Contact",
        summary: null,
        html: `<p>Healsend, Inc.<br><a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>`,
      },
    ],
  },

  "terms-of-service-2": {
    slug: "terms-of-service-2",
    title: "Terms of Service",
    description:
      "The legal agreement between you and Healsend governing your use of our platform and services.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: `<p><strong>Effective Date: October 5, 2025</strong></p><p>Healsend Inc. • 30 N Gould St Ste R, Sheridan, WY 82801 • <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>`,
    faqItems: [],
    sectionBlocks: [
      {
        id: "tos-overview",
        title: "1. Overview and Acceptance",
        summary: null,
        html: `<p>These Terms of Service ("Terms," "Agreement") constitute a legally binding contract between Healsend Inc. ("Healsend," "we," "us," or "our") and each individual ("you," "user," or "patient") who accesses or uses our websites, mobile applications, and digital platforms (collectively, the "Services" or "Platform"). By creating an account, submitting intake information, scheduling a telehealth visit, or otherwise using our Services, you acknowledge that you have read and agree to be bound by these Terms and the policies incorporated by reference.</p>
<p>The following documents form an integral part of this Agreement: Healsend Privacy Policy, Healsend Consumer Health Data &amp; Biometric Privacy Policy, and Healsend Consent to Telehealth. If you use our Services on behalf of another individual, you represent that you are legally authorized to act on that person's behalf. We may update these Terms from time to time; your continued use after such updates constitutes acceptance of the revised Terms.</p>`,
      },
      {
        id: "tos-about",
        title: "2. About Healsend",
        summary: null,
        html: `<p>Healsend is a U.S.-based technology and administrative services organization (MSO). We do not practice medicine, provide medical advice, diagnose conditions, or dispense prescription drugs. Our role is to develop and maintain software and operational infrastructure that enables independent medical groups to deliver telehealth services to patients.</p>
<p>All clinical services made available through the Platform are performed by independent, state-licensed medical groups and their providers ("Professional Entities" or "Providers"). These entities are solely responsible for the quality and legality of care they provide. Healsend's services include: hosting and maintaining the telehealth technology platform; providing customer support and scheduling tools; processing payments and subscriptions; facilitating communications; and performing data security, billing administration, and logistics coordination.</p>`,
      },
      {
        id: "tos-eligibility",
        title: "3. Eligibility and User Responsibilities",
        summary: null,
        html: `<p>To use the Services, you must: (a) be at least 18 years of age; (b) reside within the United States; and (c) have the legal capacity to enter into binding contracts. You agree to provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your username and password and must immediately notify Healsend of any unauthorized access to your account. You agree to use the Services only for lawful, personal, and non-commercial purposes. Healsend may suspend or terminate your account if you violate these Terms or provide false information.</p>`,
      },
      {
        id: "tos-services",
        title: "4. Description of Services",
        summary: null,
        html: `<p>The Platform enables users to connect with Providers for telehealth consultations and related services. Features include: electronic registration and intake forms; secure video and messaging interfaces; prescription routing and coordination with licensed pharmacies; and online payment and shipping support. Healsend does not guarantee that a particular service will be appropriate for you. Providers may decline care if they determine that telehealth is not clinically suitable or that an in-person visit is required.</p>
<p><strong>The Platform must not be used for medical emergencies.</strong> If you believe you are experiencing a life-threatening emergency, call 911 or go to the nearest emergency department.</p>`,
      },
      {
        id: "tos-relationship",
        title:
          "5. Relationship Between You, Healsend, and Professional Entities",
        summary: null,
        html: `<p>Providers using the Platform exercise their own professional medical judgment. Healsend has no authority to direct or control their practice of medicine. Nothing in this Agreement creates an employment, agency, or joint-venture relationship between Healsend and any Provider or patient. All medical diagnoses, prescriptions, and treatments are the sole responsibility of Providers acting within their licenses.</p>`,
      },
      {
        id: "tos-telehealth-consent",
        title: "6. Consent to Telehealth",
        summary: null,
        html: `<p>By using the Platform, you consent to receive telehealth services from licensed Providers through interactive audio, video, and electronic communications. You acknowledge that telehealth involves electronic transmission of personal and medical data and that certain conditions may not be diagnosable remotely. You may withdraw telehealth consent at any time by notifying your Provider or discontinuing Platform use. Withdrawal does not affect care already provided. Telehealth sessions are conducted through secure, encrypted channels and comply with HIPAA and state telemedicine laws.</p>`,
      },
      {
        id: "tos-payment",
        title: "7. Payment, Billing & Refunds",
        summary: null,
        html: `<p>By submitting your payment information, you authorize Healsend to charge all applicable fees to your designated payment method. Payments are processed by independent, PCI-DSS-compliant payment processors; Healsend does not store full credit-card numbers. If you enroll in an auto-renewing plan, recurring charges will continue until you cancel at least five (5) business days before the next billing cycle.</p>
<p>Administrative or technology fees are refundable only if the Service was not delivered or if required by law. Clinical encounter fees are non-refundable once a consultation has begun. Refunds are processed within 10 business days of approval. Before initiating any chargeback, you must give Healsend an opportunity to resolve the issue. Healsend operates solely on a self-pay basis; no claims are filed with insurance, Medicare, or Medicaid.</p>`,
      },
      {
        id: "tos-conduct",
        title: "8. User Conduct and Prohibited Uses",
        summary: null,
        html: `<p>You agree to comply with all federal and state laws, including those governing telehealth, controlled substances, and privacy. You must not: (a) impersonate another person or falsify medical or contact information; (b) attempt to gain unauthorized access to any account or system; (c) transmit malware, scripts, or spam; (d) reverse-engineer, copy, or modify any Platform component; (e) engage in abusive, threatening, or harassing communications toward staff or Providers. Violations may result in immediate termination, referral to authorities, or legal action.</p>`,
      },
      {
        id: "tos-ip",
        title: "9. Intellectual Property Rights",
        summary: null,
        html: `<p>All intellectual-property rights—including software, databases, trademarks, text, graphics, and user-interface design—belong exclusively to Healsend Inc. or its licensors. Healsend grants you a non-exclusive, revocable license to use the Platform for your personal, lawful purposes. This license does not permit resale, framing, or derivative works. Any feedback or suggestions you provide may be used by Healsend without restriction or obligation. If you believe any content violates your rights, send notice to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tos-privacy",
        title: "10. Privacy and Data Handling",
        summary: null,
        html: `<p>Healsend handles personal and health information in accordance with the Healsend Privacy Policy, the Healsend Consumer Health Data &amp; Biometric Privacy Policy, and applicable federal and state laws including HIPAA, HITECH, and the FTC Health Breach Notification Rule. When supporting a Professional Entity that is a Covered Entity, Healsend acts as a Business Associate and enters a Business Associate Agreement (BAA). Information is used only for lawful operational purposes and retained for periods required by law (generally 7 years for health records). Requests for access, correction, or deletion may be sent to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tos-communications",
        title: "11. Communications and Electronic Records",
        summary: null,
        html: `<p>You consent to receive all records and communications electronically, including legal notices, account updates, and billing receipts. This satisfies requirements for "writing" under the E-SIGN Act and state UETA laws. Transactional messages may be sent for appointments, account security, and shipping updates. Marketing messages are sent only with your express opt-in and include an unsubscribe mechanism. You may withdraw electronic consent by emailing <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tos-disclaimers",
        title: "12. Disclaimers and Limitation of Liability",
        summary: null,
        html: `<p>Healsend makes no representations that use of the Platform will produce specific health outcomes. To the maximum extent permitted by law, Healsend disclaims all warranties—express, implied, or statutory—including merchantability, fitness for a particular purpose, and non-infringement. Healsend's total liability for any claim arising from use of the Services shall not exceed the total fees paid by you in the preceding twelve (12) months. No party is liable for incidental, consequential, special, or punitive damages. You agree to defend, indemnify, and hold harmless Healsend and its officers, employees, and affiliates from any claim arising from your breach of these Terms.</p>`,
      },
      {
        id: "tos-arbitration",
        title: "13. Dispute Resolution and Arbitration",
        summary: null,
        html: `<p>Before filing any formal claim, the parties shall attempt in good faith to resolve disputes informally for at least 30 days after written notice. If unresolved, any dispute shall be resolved exclusively through binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. The seat of arbitration shall be Sheridan County, Wyoming. You and Healsend waive any right to participate in a class or representative action unless such waiver is unenforceable under applicable law. Either party may seek temporary or preliminary injunctive relief in state or federal court in Wyoming to protect intellectual property pending arbitration.</p>`,
      },
      {
        id: "tos-termination",
        title: "14. Termination of Access and Services",
        summary: null,
        html: `<p>Healsend may suspend or terminate your account without notice if: (a) you violate these Terms or any applicable law; (b) your use threatens the security or integrity of the Platform; (c) a Provider requests termination for clinical or compliance reasons; or (d) Healsend is required to do so by law. Upon termination, all licenses granted to you end immediately. You may close your account at any time by submitting a written request to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tos-governing-law",
        title: "15. Governing Law and Jurisdiction",
        summary: null,
        html: `<p>This Agreement is governed by the laws of the State of Wyoming and applicable federal laws of the United States, without regard to conflict-of-laws principles. Any judicial proceeding permitted under Section 13 shall be brought exclusively in the state or federal courts located in Sheridan County, Wyoming.</p>`,
      },
      {
        id: "tos-contact",
        title: "16. Contact Information",
        summary: null,
        html: `<p>Healsend Inc.<br>30 N Gould St Ste R, Sheridan, WY 82801<br>Email: <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p><p>Healsend strives to acknowledge all written communications within five (5) business days and provide a substantive response within thirty (30) days when required by law.</p>`,
      },
      {
        id: "tos-updates",
        title: "17. Updates to These Terms",
        summary: null,
        html: `<p>Healsend may amend these Terms from time to time to reflect changes in law, regulation, technology, or business practices. The revised version will be posted on the Platform with a new "Effective Date." Significant changes will be communicated via email or account notification. Your continued use of the Platform after any update constitutes acceptance of the revised Terms.</p>`,
      },
      {
        id: "tos-hipaa",
        title: "18. Business Associate & HIPAA Chain of Trust",
        summary: null,
        html: `<p>When Healsend performs functions for a Professional Entity that is a HIPAA Covered Entity, Healsend acts as its Business Associate as defined in 45 CFR §160.103 and § 164.502(e). Healsend executes a Business Associate Agreement (BAA) with each Covered Entity before handling Protected Health Information (PHI). Healsend implements administrative, technical, and physical safeguards that meet or exceed 45 CFR §164.308–§164.312. Subcontractors that create or receive PHI must sign written agreements imposing the same standards.</p>`,
      },
      {
        id: "tos-vendors",
        title: "19. Vendor and Sub-Processor Management",
        summary: null,
        html: `<p>Healsend uses carefully vetted third-party service providers for hosting, communication, payment, and data analysis functions. Each provider operates under a written agreement requiring confidentiality and HIPAA-equivalent safeguards. Before engagement, Healsend reviews each vendor's security certifications and breach-response protocols. All data processing occurs within the United States unless otherwise agreed in writing.</p>`,
      },
      {
        id: "tos-pharmacy",
        title: "20. Prescription Fulfillment and Pharmacy Disclosure",
        summary: null,
        html: `<p>All prescriptions issued through the Platform are filled by independent, state-licensed pharmacies operating under Section 503A or 503B of the Federal Food, Drug, and Cosmetic Act. Healsend does not compound, manufacture, dispense, or ship medications. Healsend does not own, operate, or receive commissions from any pharmacy. Pharmacies are responsible for drug quality, storage, and FDA recall compliance.</p>`,
      },
      {
        id: "tos-refunds-chargebacks",
        title: "21. Refunds, Chargebacks & Consumer Protections",
        summary: null,
        html: `<p>Administrative, technology, and subscription fees are non-refundable once services have commenced unless required by law or the service was not delivered. Provider consultation fees and telehealth encounter charges are non-refundable once a Provider review has begun. Requests must be submitted to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> within thirty (30) days of the transaction date. Approved refunds are processed within ten (10) business days. You agree not to initiate a chargeback until Healsend has had ten (10) business days to resolve your complaint. Nothing in this section limits your rights under the FTC Act or state consumer-protection laws.</p>`,
      },
      {
        id: "tos-sms-tcpa",
        title: "22. SMS, Email & TCPA Consent",
        summary: null,
        html: `<p>By providing a mobile number or email address, you consent to receive non-marketing communications about appointments, account activity, prescription status, and billing. Promotional SMS or emails are sent only with your explicit written consent and include clear unsubscribe options per the CAN-SPAM Act and TCPA 47 U.S.C. § 227. You may reply "STOP" to any SMS to end messaging. Standard message and data rates may apply. Consent records are retained for four (4) years.</p>`,
      },
      {
        id: "tos-accessibility",
        title: "23. Accessibility (ADA § 508 / WCAG 2.1 AA)",
        summary: null,
        html: `<p>Healsend is committed to digital accessibility for all users, including those with disabilities. Our Platform is designed to meet or exceed Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and Americans with Disabilities Act (ADA) § 508 standards. Accessibility audits are performed annually. If you encounter an accessibility issue, please contact <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>; we acknowledge reports within five (5) business days and aim to resolve confirmed issues within thirty (30) days.</p>`,
      },
      {
        id: "tos-bcp",
        title: "24. Business Continuity & Incident Response",
        summary: null,
        html: `<p>Healsend maintains a documented Business Continuity and Disaster Recovery (BC/DR) plan. Platform data is stored in redundant, encrypted U.S.-based data centers. In the event of a breach or security incident involving Consumer Health Data or PHI, Healsend will notify affected individuals and regulators within the time frames required by 45 CFR § 164.404 and applicable state laws. Personnel undergo biannual training on incident response protocols. Healsend is not liable for failures caused by events beyond its reasonable control.</p>`,
      },
      {
        id: "tos-state-addenda",
        title: "25. State-Specific Addenda",
        summary: null,
        html: `<h3>California (CCPA/CPRA)</h3><p>California residents have rights to know, delete, correct, and opt out of data sharing. Healsend does not sell personal information as defined by Cal. Civ. Code § 1798.140.</p>
<h3>Washington (My Health My Data Act)</h3><p>Explicit consent is required before collecting Consumer Health Data from Washington residents. Deletion requests are honored within forty-five (45) days.</p>
<h3>Texas (Health &amp; Safety Code Chapter 181)</h3><p>All personnel with access to health information receive state-specific privacy training annually.</p>
<h3>Florida Telehealth Act</h3><p>Providers delivering care to Florida patients comply with state licensure requirements per F.S. § 456.47.</p>
<h3>New York</h3><p>Telehealth services comply with Public Health Law § 2999-cc. Providers retain consent records for at least six (6) years.</p>
<h3>Colorado &amp; Virginia</h3><p>Healsend honors consumer rights to access, deletion, and correction. Where state law provides greater protections, the stricter consumer-protection rule prevails.</p>`,
      },
      {
        id: "tos-entire-agreement",
        title: "26. Entire Agreement and Execution",
        summary: null,
        html: `<p>These Terms, together with all incorporated policies and consents, constitute the entire agreement between you and Healsend regarding use of the Services and supersede all prior oral or written understandings. No waiver of any term shall be deemed a continuing waiver. You may not assign these Terms without Healsend's prior written consent. Healsend may assign its rights to any successor entity in connection with a merger or reorganization.</p>
<p>Sections 12 (Disclaimers and Limitation of Liability), 13 (Arbitration), 15 (Governing Law), 18 (HIPAA Chain of Trust), and 24 (Business Continuity) survive termination or expiration of this Agreement.</p>
<p><strong>By creating an account or continuing to use the Healsend Platform, you acknowledge that you have read, understood, and agreed to be bound by this entire Terms of Service, effective as of October 5, 2025.</strong></p>`,
      },
    ],
  },

  "consent-to-telehealth-2": {
    slug: "consent-to-telehealth-2",
    title: "Consent to Telehealth",
    description:
      "Your rights, responsibilities, and the benefits and limitations of receiving care through Healsend's telehealth platform.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: `<p><strong>Effective Date: October 5, 2025</strong></p><p>Healsend Inc. • 30 N Gould St Ste R, Sheridan, WY 82801 • <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>`,
    faqItems: [],
    sectionBlocks: [
      {
        id: "ctt-scope",
        title: "Purpose and Scope",
        summary: null,
        html: `<p>This document describes how telemedicine services are provided through the Healsend technology platform ("Platform") and the rights and obligations of patients, Providers, and Healsend. It applies to all telehealth encounters conducted through the Platform by independent medical groups ("Professional Entities") using Healsend's software and administrative infrastructure.</p>
<p>Healsend is a technology and administrative-services organization (MSO). It does not provide medical care or employ physicians; all clinical decisions are made by the licensed Providers who contract with Professional Entities.</p>`,
      },
      {
        id: "ctt-methods",
        title: "Nature of Telehealth and Methods of Delivery",
        summary: null,
        html: `<p>Telehealth involves real-time and asynchronous communication technologies, including:</p>
<ul>
<li>Live audio-video consultations</li>
<li>Secure messaging and chat</li>
<li>Asynchronous "store-and-forward" image and data exchange</li>
<li>Remote patient monitoring devices when applicable</li>
</ul>
<p>Providers determine which modality is appropriate. The encounter and records are documented in an electronic health record (EHR) maintained by the Professional Entity.</p>`,
      },
      {
        id: "ctt-parties",
        title: "Parties to the Encounter",
        summary: null,
        html: `<ul>
<li><strong>Patient / Client:</strong> the individual seeking medical evaluation or treatment.</li>
<li><strong>Provider:</strong> a duly licensed physician, nurse practitioner, or physician assistant who renders care through a Professional Entity.</li>
<li><strong>Professional Entity:</strong> an independent medical group authorized to provide telehealth services in your state.</li>
<li><strong>Healsend Inc.:</strong> the MSO providing technology, scheduling, billing, and non-clinical support. Healsend is not a Covered Entity under HIPAA except when acting as a Business Associate for Professional Entities.</li>
</ul>`,
      },
      {
        id: "ctt-benefits",
        title: "Benefits of Telehealth",
        summary: null,
        html: `<p>Telehealth can:</p>
<ul>
<li>Increase access to licensed clinicians across geographic areas</li>
<li>Shorten wait times for evaluation and prescription</li>
<li>Reduce costs related to travel and time off work</li>
<li>Allow secure follow-up communications</li>
<li>Facilitate ongoing monitoring of chronic conditions</li>
</ul>`,
      },
      {
        id: "ctt-risks",
        title: "Limitations and Risks",
        summary: null,
        html: `<p>You acknowledge that telehealth:</p>
<ul>
<li>May not permit full physical examination or diagnostic testing</li>
<li>May result in incomplete information affecting medical decisions</li>
<li>Relies on your disclosure of accurate health data</li>
<li>May experience technical interruptions or cybersecurity incidents</li>
<li>Is not a substitute for emergency care</li>
</ul>
<p>Providers may determine that in-person evaluation or laboratory testing is necessary.</p>`,
      },
      {
        id: "ctt-alternatives",
        title: "Alternatives",
        summary: null,
        html: `<p>You have the right to obtain in-person care from any licensed provider at any time. Refusing telehealth will not affect your eligibility for future in-person care or benefits.</p>`,
      },
      {
        id: "ctt-patient-reps",
        title: "Patient Representations",
        summary: null,
        html: `<p>You represent that:</p>
<ul>
<li>You are at least 18 years old and physically located in a U.S. state where your Provider is licensed</li>
<li>The information you submit is true and complete</li>
<li>You will not record or share the session without consent</li>
<li>You will comply with treatment and follow-up instructions</li>
</ul>`,
      },
      {
        id: "ctt-provider-resp",
        title: "Provider Responsibilities",
        summary: null,
        html: `<p>Each Provider:</p>
<ul>
<li>Holds active licensure in your state</li>
<li>Maintains malpractice insurance as required by law</li>
<li>Determines whether telehealth is appropriate for your condition</li>
<li>Maintains an EHR record of each encounter</li>
<li>Provides referrals when medically necessary</li>
<li>May decline to treat if telehealth is not suitable</li>
</ul>`,
      },
      {
        id: "ctt-pharmacy",
        title: "Pharmacy, Laboratory, and Third-Party Coordination",
        summary: null,
        html: `<p>When a prescription, diagnostic test, or laboratory order is issued:</p>
<ul>
<li>It is transmitted to a licensed U.S. pharmacy or CLIA-certified lab of your choosing</li>
<li>Healsend merely facilitates secure data transfer</li>
<li>The Provider and pharmacy remain solely responsible for dispensing accuracy and clinical safety</li>
<li>You may request record transfers to your personal physician at any time</li>
</ul>`,
      },
      {
        id: "ctt-privacy",
        title: "Privacy and Security",
        summary: null,
        html: `<p>All electronic communications are encrypted and conducted over HIPAA-compliant systems. Your data may be used or disclosed only to: facilitate diagnosis and treatment; coordinate billing or payment; meet legal and regulatory obligations; or improve platform operations in de-identified form. Healsend adheres to HIPAA, HITECH, FTC Health Breach Notification Rule, and relevant state privacy statutes.</p>`,
      },
      {
        id: "ctt-patient-rights",
        title: "Patient Rights",
        summary: null,
        html: `<p>You have the right to:</p>
<ul>
<li>Be treated with respect, regardless of race, gender, or background</li>
<li>Receive clear explanations of your condition and treatment</li>
<li>Ask questions and obtain second opinions</li>
<li>Access or request copies of your medical records</li>
<li>Revoke consent at any time</li>
<li>File privacy or service complaints without retaliation</li>
</ul>`,
      },
      {
        id: "ctt-complaints",
        title: "Complaints and Grievances",
        summary: null,
        html: `<p>Concerns regarding telehealth encounters or professional conduct should be directed to:</p>
<ul>
<li>The Professional Entity or Provider for clinical issues</li>
<li>Healsend at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> for technical or administrative matters</li>
</ul>
<p>Serious complaints may also be submitted to your state's medical or nursing board.</p>`,
      },
      {
        id: "ctt-emergencies",
        title: "Emergencies",
        summary: null,
        html: `<p><strong>Telehealth is not intended for emergency conditions.</strong> If you experience symptoms such as chest pain, shortness of breath, severe bleeding, suicidal thoughts, or sudden vision loss, call 911 or go to the nearest emergency department.</p>`,
      },
      {
        id: "ctt-retention",
        title: "Data Retention and Recordkeeping",
        summary: null,
        html: `<p>Professional Entities retain medical records in accordance with federal and state retention laws (typically 7 years or longer for adults). Healsend retains platform data for administrative and security purposes per its data-retention schedule and securely deletes information when no longer required.</p>`,
      },
      {
        id: "ctt-electronic-consent",
        title: "Consent to Electronic Communications",
        summary: null,
        html: `<p>You consent to receive medical information, disclosures, and follow-ups electronically (email, SMS, patient portal). You may revoke this consent by emailing Healsend; however, doing so may limit service functionality.</p>`,
      },
      {
        id: "ctt-costs",
        title: "Acknowledgment of Potential Costs",
        summary: null,
        html: `<p>You acknowledge that:</p>
<ul>
<li>Telehealth services are generally self-pay</li>
<li>Insurance reimbursement may vary</li>
<li>You are responsible for applicable fees and co-payments</li>
<li>Prescription costs are determined by the dispensing pharmacy</li>
</ul>`,
      },
      {
        id: "ctt-state-disclosures",
        title: "Multi-State Legal Disclosures",
        summary: null,
        html: `<h3>California</h3><p>Telehealth complies with Bus. &amp; Prof. Code § 2290.5; informed consent is required and retained.</p>
<h3>Florida</h3><p>Out-of-state Providers are registered with the Florida DOH per F.S. § 456.47.</p>
<h3>Texas</h3><p>Encounters meet Texas Medical Board Rule § 174 standards, including identity verification and documentation.</p>
<h3>Washington</h3><p>Each session requires renewed consent per RCW 70.41.230.</p>
<h3>New York</h3><p>Providers follow Public Health Law § 2999-cc and maintain consent records for six years.</p>
<h3>Virginia &amp; Colorado</h3><p>Patients may exercise rights to access and correction of telehealth data under state privacy acts.</p>
<h3>Illinois</h3><p>For biometric or image-based features, Healsend complies with BIPA and deletes identifiers after use.</p>`,
      },
      {
        id: "ctt-tech-requirements",
        title: "Technology Requirements and Security Warnings",
        summary: null,
        html: `<p>You are responsible for maintaining compatible devices and secure networks. Use of public Wi-Fi or shared computers increases privacy risks. Healsend employs encryption, multi-factor authentication, and secure session tokens but cannot guarantee complete protection against unauthorized access beyond its control.</p>`,
      },
      {
        id: "ctt-withdrawal",
        title: "Withdrawal of Consent",
        summary: null,
        html: `<p>You may withdraw consent by written notice to Healsend or your Provider. Withdrawal stops future telehealth services but does not affect prior care or records already created.</p>`,
      },
      {
        id: "ctt-acknowledgment",
        title: "Acknowledgment",
        summary: null,
        html: `<p>By clicking "I Consent," typing your name, or otherwise electronically signing within the Platform, you affirm that:</p>
<ul>
<li>You understand the nature, benefits, and risks of telehealth</li>
<li>You authorize Providers to deliver care using these technologies</li>
<li>You agree to Healsend's policies and understand Healsend is not a medical provider</li>
</ul>
<p>Healsend Inc. • 30 N Gould St Ste R, Sheridan, WY 82801 • <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>`,
      },
    ],
  },

  "safety-information": {
    slug: "safety-information",
    title: "Safety Information",
    description:
      "Important safety information for all medications and treatments available through Healsend.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "si-general",
        title: "1. Important Safety Information",
        summary: null,
        html: `<p>We encourage our patients to report negative side effects of prescription drugs to the FDA. Visit <a href="https://www.fda.gov/medwatch" target="_blank" rel="noopener noreferrer">fda.gov/medwatch</a> or call 1-800-FDA-1088. If you have a medical emergency, call 911 immediately.</p>`,
      },
      {
        id: "si-advertisements",
        title: "2. Healsend Advertisements",
        summary: null,
        html: `<p>All Healsend advertisements are paid for by Healsend. Advertisements may include paid actors. Results may vary and outcomes are not guaranteed.</p>`,
      },
      {
        id: "si-services",
        title: "3. Healsend Services",
        summary: null,
        html: `<p>Healsend offers and/or facilitates access to licensed medical professional consultations. Healsend is NOT a medical provider or pharmacy. Healsend provides software and technology services only.</p>`,
      },
      {
        id: "si-special-offers",
        title: "4. Special Advertising Offers",
        summary: null,
        html: `<p>Special advertising offers may be available for up to 24 hours after removal of the original advertisement. Healsend reserves the right to adjust pricing. "Same price per dose" offers are subject to additional terms.</p>`,
      },
      {
        id: "si-prescription",
        title: "5. Prescription Medications",
        summary: null,
        html: `<p>All prescription medications require a consultation and a prescription. Prescriptions are solely determined by a licensed medical professional. Access to prescription medications is not guaranteed.</p>`,
      },
      {
        id: "si-compounded",
        title: "6. Compounded Medications",
        summary: null,
        html: `<p>Compounded medications are prepared by licensed USA-based 503A or 503B pharmacies. Compounded medications are NOT FDA-approved. They may be prescribed during periods of drug shortage or for individual patient needs.</p>`,
      },
      {
        id: "si-trademarks",
        title: "7. Trademarks",
        summary: null,
        html: `<p>Healsend does not claim ownership over brand-name FDA-approved medications. All trademarks belong to their respective owners.</p>`,
      },
      {
        id: "si-inquiries",
        title: "8. Inquiries",
        summary: null,
        html: `<p>For questions or concerns, visit <a href="https://healsend.com">Healsend.com</a>.</p>`,
      },
      {
        id: "si-semaglutide",
        title: "9. Compounded GLP-1 (Semaglutide)*",
        summary: null,
        html: `<p><em>*This medication is not FDA-regulated as a compounded formulation.</em></p>
<h3>WARNING</h3>
<p>Seek emergency help if you have symptoms of a serious allergic reaction, including swelling of your face, lips, tongue, or throat; problems breathing or swallowing; severe rash or itching; fainting or feeling dizzy; very rapid heartbeat.</p>
<p>Tell your healthcare provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath. These may be symptoms of thyroid cancer.</p>
<p>Women of childbearing age should use adequate contraception during treatment. Stop taking semaglutide at least 2 months before a planned pregnancy due to the long half-life of the drug.</p>
<h3>Drug Interactions</h3>
<p>Semaglutide slows gastric emptying, which may impact the absorption of concomitantly administered oral medications. Use with insulin or insulin secretagogues may increase the risk of hypoglycemia; dose reduction may be required.</p>
<h3>BLACK BOX WARNING — Thyroid C-Cell Tumors</h3>
<p>Semaglutide causes thyroid C-cell tumors in rodents at clinically relevant exposures. It is unknown whether semaglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans, as the human relevance of semaglutide-induced rodent thyroid C-cell tumors has not been determined.</p>
<p>Semaglutide is contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2). Counsel patients regarding the potential risk of MTC and the symptoms of thyroid tumors.</p>`,
      },
      {
        id: "si-tirzepatide",
        title: "10. Compounded GLP-1+GIP (Tirzepatide)*",
        summary: null,
        html: `<p><em>*This medication is not FDA-regulated as a compounded formulation.</em></p>
<h3>WARNING</h3>
<p>Tirzepatide causes thyroid C-cell tumors in rats. It is unknown whether tirzepatide causes thyroid tumors, including medullary thyroid carcinoma (MTC), in humans. Tirzepatide is contraindicated in patients with a personal or family history of MTC or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2). Counsel patients to report symptoms such as a mass in the neck, dysphagia, dysphonia, or dyspnea.</p>
<h3>Serious Side Effects</h3>
<ul>
<li>Pancreatitis: discontinue if suspected</li>
<li>Hypoglycemia, especially when used with insulin or sulfonylureas</li>
<li>Acute kidney injury</li>
<li>Serious hypersensitivity reactions (angioedema, anaphylaxis)</li>
<li>Acute gallbladder disease</li>
<li>Diabetic retinopathy complications</li>
</ul>
<h3>Common Side Effects</h3>
<ul>
<li>Nausea, diarrhea, vomiting, constipation</li>
<li>Abdominal pain, dyspepsia</li>
<li>Decreased appetite</li>
<li>Fatigue, dizziness</li>
<li>Injection site reactions</li>
</ul>
<h3>Drug Interactions</h3>
<p>Oral contraceptives: administer oral contraceptives at least 4 weeks before initiating tirzepatide and for 4 weeks after each dose increase, as tirzepatide may lower the effect of oral contraceptives. Consider switching to a non-oral contraceptive or adding a barrier method during dose escalation.</p>`,
      },
      {
        id: "si-nad",
        title: "11. NAD+",
        summary: null,
        html: `<h3>Common Side Effects</h3>
<p><strong>Injection:</strong> Flushing, warmth, tingling, nausea, fatigue, headache, injection-site reactions.</p>
<p><strong>Nasal Spray:</strong> Nasal irritation, headache, mild flushing.</p>
<h3>More Serious Side Effects</h3>
<p>Allergic reactions (rash, difficulty breathing); contact your provider immediately if these occur.</p>
<h3>Warnings</h3>
<ul>
<li>Limited long-term human safety data</li>
<li>Not FDA-approved for any specific indication</li>
<li>Discuss duration of therapy and monitoring with your provider</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Known allergy to NAD+ or formulation components</li>
<li>Active cancer (discuss with oncologist)</li>
</ul>
<h3>Drug Interactions</h3>
<p>May theoretically interact with PARP inhibitors. Inform your provider of all medications and supplements.</p>
<h3>Pregnancy &amp; Breastfeeding</h3>
<p>Insufficient data; avoid unless directed by your provider.</p>
<h3>Storage</h3>
<p>Refrigerate at 2–8°C; protect from light. Do not use if discolored or if particulate matter is visible.</p>
<h3>Have Questions?</h3>
<p>Contact your Healsend provider through the platform messaging system.</p>`,
      },
      {
        id: "si-sermorelin",
        title: "12. Sermorelin",
        summary: null,
        html: `<h3>Safety Information</h3>
<p>Sermorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH) that stimulates the pituitary gland to produce and release growth hormone.</p>
<h3>Common Side Effects</h3>
<ul>
<li>Injection site reactions (redness, pain, swelling)</li>
<li>Flushing, headache, dizziness, nausea</li>
</ul>
<h3>Less Common / Rare Side Effects</h3>
<ul>
<li>Changes in taste, hyperactivity, somnolence</li>
<li>Difficulty swallowing (rare)</li>
</ul>
<h3>Warnings</h3>
<ul>
<li>May increase IGF-1 levels; routine monitoring recommended</li>
<li>Hypothyroidism may reduce response; treat underlying thyroid conditions before or during therapy</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Known hypersensitivity to sermorelin or formulation components</li>
<li>Active malignancy</li>
</ul>
<h3>Drug Interactions</h3>
<ul>
<li>Glucocorticoids may blunt the effect on growth hormone release</li>
<li>Insulin and anti-diabetic agents: monitor glucose closely</li>
</ul>
<h3>Pregnancy &amp; Breastfeeding</h3>
<p>Category C; insufficient human data. Avoid unless benefits outweigh risks as determined by your provider.</p>
<h3>Storage</h3>
<p>Refrigerate at 2–8°C. Reconstituted solutions should be used within the timeframe specified by the pharmacy, typically within 30 days.</p>
<h3>Have Questions?</h3>
<p>Contact your Healsend provider through the platform messaging system.</p>`,
      },
      {
        id: "si-pt141",
        title: "13. Compounded PT-141 Nasal Spray (Bremelanotide)*",
        summary: null,
        html: `<p><em>*This medication is not FDA-regulated as a compounded nasal spray formulation.</em></p>
<h3>WARNING</h3>
<p>PT-141 can cause transient increases in blood pressure. Do not use if you have cardiovascular disease or uncontrolled hypertension. Blood pressure typically returns to baseline within 12 hours.</p>
<h3>Drug Interactions</h3>
<ul>
<li><strong>Naltrexone:</strong> Reduces effectiveness; avoid co-administration</li>
<li><strong>Antihypertensives:</strong> Monitor blood pressure; effects may interact</li>
<li>Do not use with other melanocortin agonists</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Cardiovascular disease or uncontrolled hypertension</li>
<li>Pregnancy or breastfeeding</li>
<li>Hypersensitivity to bremelanotide or formulation components</li>
</ul>
<h3>Common Side Effects</h3>
<ul>
<li>Flushing (most common)</li>
<li>Nausea, headache</li>
<li>Nasal congestion or irritation</li>
<li>Transient blood pressure increase</li>
<li>Hyperpigmentation with frequent use (typically fades after discontinuation)</li>
</ul>
<h3>Storage</h3>
<p>Store at room temperature (15–30°C), away from heat and light. Do not freeze. Discard per compounding pharmacy guidelines.</p>`,
      },
    ],
  },

  "terms-of-service-2": {
    slug: "terms-of-service-2",
    title: "Terms of Service",
    description:
      "The binding agreement governing your use of the Healsend platform and telehealth services.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "tos-overview",
        title: "1. Overview and Acceptance",
        summary: null,
        html: `<p><strong>Effective Date: October 5, 2025</strong></p>
<p>These Terms of Service ("Terms") constitute a binding agreement between you and Healsend Inc. ("Healsend," "we," "us"). By accessing or using the Healsend platform ("Platform"), you agree to these Terms. If you do not agree, do not use the Platform.</p>
<p>These Terms incorporate by reference our <a href="/privacy-policy">Privacy Policy</a>, <a href="/consent-to-telehealth-2">Telehealth Consent</a>, <a href="/refund-policy">Refund Policy</a>, and <a href="/safety-information">Safety Information</a>. In the event of a conflict between these Terms and any incorporated document, these Terms control.</p>
<p>Healsend may assign its rights and obligations under these Terms to any successor entity or acquirer. You may not assign your rights without our written consent. We reserve the right to modify these Terms with reasonable notice; continued use after the effective date constitutes acceptance.</p>`,
      },
      {
        id: "tos-about",
        title: "2. About Healsend",
        summary: null,
        html: `<p>Healsend Inc. is a Management Services Organization (MSO) and technology company. We provide administrative, operational, and technology infrastructure to independent licensed medical practices and Professional Entities. Healsend does not practice medicine, employ physicians, or engage in the corporate practice of medicine.</p>
<p>All clinical decisions — including diagnoses, treatment recommendations, and prescription issuance — are made solely by licensed healthcare providers affiliated with independent Professional Entities. Your use of the Platform does not create a physician-patient relationship with Healsend.</p>`,
      },
      {
        id: "tos-eligibility",
        title: "3. Eligibility and User Responsibilities",
        summary: null,
        html: `<p>You must be at least 18 years of age and a resident of the United States to use the Platform. By creating an account, you represent that:</p>
<ul>
<li>All information you provide is accurate, current, and complete</li>
<li>You will maintain the security of your account credentials</li>
<li>You will promptly update your information if it changes</li>
<li>You will not allow others to use your account</li>
</ul>
<p>Prohibited uses include: impersonating another person; providing false health information; attempting to obtain controlled substances fraudulently; using automated tools to access the Platform; or any use that violates applicable law.</p>`,
      },
      {
        id: "tos-services",
        title: "4. Description of Services",
        summary: null,
        html: `<p>Through the Platform, Healsend facilitates:</p>
<ul>
<li>Electronic health registration and clinical intake</li>
<li>Secure video and asynchronous messaging consultations with licensed providers</li>
<li>Electronic prescription routing to licensed pharmacies</li>
<li>Payment processing and medication shipping coordination</li>
</ul>
<p>The Platform is not intended for medical emergencies. If you are experiencing an emergency, call 911 immediately.</p>`,
      },
      {
        id: "tos-relationship",
        title:
          "5. Relationship Between You, Healsend, and Professional Entities",
        summary: null,
        html: `<p>Providers affiliated with Professional Entities exercise independent clinical judgment. They are not employees or agents of Healsend. All prescriptions, clinical findings, and treatment decisions are the sole responsibility of your treating Provider.</p>
<p>Healsend does not direct or control the clinical decisions of any Provider. Healsend's role is limited to administrative support, technology services, and operational management.</p>`,
      },
      {
        id: "tos-consent-telehealth",
        title: "6. Consent to Telehealth",
        summary: null,
        html: `<p>By using the Platform, you consent to receive healthcare services via telehealth, including audio, video, and electronic/asynchronous communication. You may withdraw consent at any time, but withdrawal may limit or terminate your ability to receive services through the Platform.</p>
<p>All telehealth communications are transmitted using HIPAA-compliant encryption. For full details, please review our <a href="/consent-to-telehealth-2">Consent to Telehealth Policy</a>.</p>`,
      },
      {
        id: "tos-payment",
        title: "7. Payment, Billing & Refunds",
        summary: null,
        html: `<p>By providing payment information, you authorize Healsend to charge the stated amount. All transactions are processed via PCI-DSS compliant payment processors. Plans are auto-renewing unless cancelled prior to the renewal date.</p>
<p>Before initiating a chargeback or payment dispute, you agree to contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. The Platform does not accept insurance; all payments are self-pay. You are responsible for all applicable taxes.</p>
<p>Refunds are governed by our <a href="/refund-policy">Refund Policy</a>. In summary: refunds are available when treatments are clinically unavailable for you. Consultation fees are non-refundable after clinical review is complete.</p>`,
      },
      {
        id: "tos-conduct",
        title: "8. User Conduct and Prohibited Uses",
        summary: null,
        html: `<p>You agree to comply with all applicable federal and state laws in your use of the Platform. Prohibited conduct includes:</p>
<ul>
<li>Impersonation or submitting false enrollment information</li>
<li>Unauthorized access attempts or use of automated scraping tools</li>
<li>Uploading malware or otherwise interfering with Platform integrity</li>
<li>Attempting to obtain prescription medications through fraudulent means</li>
</ul>
<p>We monitor Platform usage for compliance and reserve the right to suspend or terminate accounts for violations.</p>`,
      },
      {
        id: "tos-ip",
        title: "9. Intellectual Property Rights",
        summary: null,
        html: `<p>All intellectual property on the Platform — including software, designs, trademarks, and content — is owned by or licensed to Healsend. We grant you a non-exclusive, revocable, non-transferable license to use the Platform for personal healthcare purposes only.</p>
<p>Any feedback or suggestions you provide may be used by Healsend without restriction or compensation. DMCA takedown requests should be sent to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "tos-privacy",
        title: "10. Privacy and Data Handling",
        summary: null,
        html: `<p>Your use of the Platform is subject to our <a href="/privacy-policy">Privacy Policy</a> and <a href="/consumer-health-data">Consumer Health Data Policy</a>. Health information is handled under a Business Associate Agreement (BAA) with applicable Covered Entities. We retain health records for a minimum of 7 years. All stored data is encrypted.</p>`,
      },
      {
        id: "tos-communications",
        title: "11. Communications and Electronic Records",
        summary: null,
        html: `<p>By creating an account, you consent to receive electronic records and disclosures, as permitted by the Electronic Signatures in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).</p>
<p>We may send transactional communications (receipts, appointment reminders, clinical notifications) and, with consent, marketing communications. You may withdraw consent to marketing communications at any time via the unsubscribe link in any marketing email.</p>`,
      },
      {
        id: "tos-disclaimers",
        title: "12. Disclaimers and Limitation of Liability",
        summary: null,
        html: `<p>THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT TO THE MAXIMUM EXTENT PERMITTED BY LAW.</p>
<p>HEALSEND'S MAXIMUM LIABILITY FOR ANY CLAIM ARISING FROM YOUR USE OF THE PLATFORM IS LIMITED TO THE TOTAL FEES PAID BY YOU IN THE 12-MONTH PERIOD PRECEDING THE CLAIM. WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
<p>You agree to indemnify and hold harmless Healsend and its affiliates, officers, employees, and agents from any claims arising out of your violation of these Terms, your use of the Platform, or your provision of false information.</p>`,
      },
      {
        id: "tos-disputes",
        title: "13. Dispute Resolution and Arbitration",
        summary: null,
        html: `<p>Before initiating arbitration, you agree to attempt informal resolution by contacting us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> and allowing 30 days for resolution.</p>
<p>If informal resolution fails, all disputes shall be resolved by binding individual arbitration under the AAA Consumer Arbitration Rules. You waive the right to participate in class-action litigation. Nothing in this section prevents either party from seeking injunctive relief in court for IP infringement or platform abuse.</p>`,
      },
      {
        id: "tos-termination",
        title: "14. Termination",
        summary: null,
        html: `<p>Healsend may suspend or terminate your access without notice for material violations of these Terms. Upon termination, your license to use the Platform ends immediately. Data will be retained and disposed of per applicable law and our Privacy Policy. Provisions that by their nature should survive termination (including dispute resolution, liability limitations, and IP rights) shall survive.</p>`,
      },
      {
        id: "tos-governing-law",
        title: "15. Governing Law and Jurisdiction",
        summary: null,
        html: `<p>These Terms are governed by the laws of the State of Wyoming, without regard to conflict of law principles. For matters not subject to arbitration, the parties consent to the exclusive jurisdiction of the state and federal courts located in Sheridan County, Wyoming. If any provision of these Terms is found unenforceable, the remaining provisions continue in full force.</p>`,
      },
      {
        id: "tos-contact",
        title: "16. Contact Information",
        summary: null,
        html: `<p>Healsend Inc.<br>30 N Gould St Ste R<br>Sheridan, WY 82801<br><a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></p>
<p>We acknowledge all written inquiries within 5 business days.</p>`,
      },
      {
        id: "tos-updates",
        title: "17. Updates to Terms",
        summary: null,
        html: `<p>We post a new Effective Date whenever we update these Terms. Material changes are communicated by email and via a notice on the Platform homepage. Prior versions of the Terms are archived for 7 years. Your continued use of the Platform after the effective date of any update constitutes acceptance of the revised Terms.</p>`,
      },
      {
        id: "tos-hipaa",
        title: "18. Business Associate & HIPAA Chain of Trust",
        summary: null,
        html: `<p>Where Healsend functions as a Business Associate under 45 CFR Part 164, it maintains HIPAA-compliant administrative (§164.308), physical (§164.310), and technical (§164.312) safeguards. Healsend requires sub-processor BAAs from all subcontractors handling PHI and provides audit reports to applicable Covered Entities upon request.</p>`,
      },
      {
        id: "tos-vendors",
        title: "19. Vendor and Sub-Processor Management",
        summary: null,
        html: `<p>Third-party vendors and sub-processors are vetted prior to engagement and are contractually required to implement security measures equivalent to Healsend's standards. All patient data is processed within the United States. A list of sub-processors is available upon request.</p>`,
      },
      {
        id: "tos-pharmacy",
        title: "20. Prescription Fulfillment and Pharmacy Disclosure",
        summary: null,
        html: `<p>Medications are dispensed by independent licensed 503A or 503B pharmacies. Healsend does not own or control any pharmacy. Healsend does not receive ownership interests or per-prescription commissions from any pharmacy.</p>`,
      },
      {
        id: "tos-refunds-chargebacks",
        title: "21. Refunds, Chargebacks & Consumer Protections",
        summary: null,
        html: `<p>Administrative fees are non-refundable once services have commenced. Consultation fees are non-refundable after a clinical review is complete. Before filing a chargeback, you agree to notify us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> at least 10 days in advance. Nothing in these Terms limits your rights under applicable state consumer protection laws or FTC regulations.</p>`,
      },
      {
        id: "tos-sms-tcpa",
        title: "22. SMS, Email & TCPA Consent",
        summary: null,
        html: `<p>By providing your phone number, you consent to receive transactional SMS messages related to your care (appointment reminders, prescription updates, billing notifications). Marketing SMS messages require separate opt-in consent. You may opt out of marketing messages at any time by replying STOP. Message frequency is approximately 4 messages per month for transactional communications. Consent records are retained for 4 years.</p>`,
      },
      {
        id: "tos-accessibility",
        title: "23. Accessibility",
        summary: null,
        html: `<p>We are committed to accessibility under ADA Section 508 and WCAG 2.1 AA standards. We conduct annual accessibility audits. To report accessibility barriers or request accommodations, contact <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We aim to resolve reported accessibility issues within 30 days.</p>`,
      },
      {
        id: "tos-bcp",
        title: "24. Business Continuity & Incident Response",
        summary: null,
        html: `<p>Healsend maintains a Business Continuity and Disaster Recovery (BC/DR) plan with redundant U.S. data centers. In the event of a HIPAA breach, we provide notification per 45 CFR §164.404. All personnel with access to PHI receive HIPAA training at least every 6 months. Our platform is designed to remain available during reasonable disruptions through automatic failover. Force majeure events (natural disasters, government actions, etc.) that prevent performance will not constitute a breach of these Terms.</p>`,
      },
      {
        id: "tos-state-addenda",
        title: "25. State-Specific Addenda",
        summary: null,
        html: `<h3>California</h3>
<p>California consumers have rights under the CCPA/CPRA as described in our <a href="/privacy-policy">Privacy Policy</a>. California law requires that certain disclosures be made regarding arbitration; the AAA Consumer Arbitration Rules govern this agreement.</p>
<h3>Washington</h3>
<p>Washington residents have consumer health data rights under the My Health My Data Act (MHMDA). We fulfill deletion requests within 45 days. See our <a href="/consumer-health-data">Consumer Health Data Policy</a>.</p>
<h3>Texas</h3>
<p>Texas residents' health information is protected under Texas HB300 (Texas Medical Records Privacy Act). We maintain BAAs with all entities handling Texas residents' health information.</p>
<h3>Florida</h3>
<p>Florida residents have rights under Florida Statute §456.47 regarding telehealth services. State-specific service limitations may apply based on scope-of-practice regulations.</p>
<h3>New York</h3>
<p>New York requires 6-year retention of medical records. We comply with this requirement for all New York residents.</p>
<h3>Colorado & Virginia</h3>
<p>Residents of these states have rights under their respective Consumer Data Protection Acts. Where state law provides greater protections than these Terms, the stricter rule prevails.</p>`,
      },
      {
        id: "tos-entire-agreement",
        title: "26. Entire Agreement and Execution",
        summary: null,
        html: `<p>These Terms, together with all incorporated policies, constitute the entire agreement between you and Healsend and supersede all prior agreements or understandings. No waiver of any term shall be deemed a continuing waiver or waiver of any other term. You may not assign your rights under these Terms without Healsend's prior written consent.</p>
<p>Sections 9 (Intellectual Property), 12 (Disclaimers and Limitation of Liability), 13 (Dispute Resolution), 15 (Governing Law), 18 (Business Associate), and 26 (Entire Agreement) survive termination of these Terms.</p>
<p><strong>By using the Healsend platform, you acknowledge that you have read, understood, and agree to these Terms of Service.</strong></p>`,
      },
    ],
  },
};
