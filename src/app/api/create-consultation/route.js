import { getCurrentUser } from "@/lib/auth";
import {
  buildMdiOrderPayload,
  buildOrderMdiUpdate,
  buildUserMdiUpdate,
  createDirectMdiIntakeForOrder,
  ensureMdiPartnerIdentifiers,
  ensureMdiFullscreenUrl,
  hydrateMdiPatientForOrder,
  getMdiCustomerAuth,
  findMdiPatientByEmail,
  getLocalFallbackConsultationUrl,
  getMdiAccessToken,
  getMdiConfig,
  getMdiMessagingAuth,
  waitForMdiOrderVouchers,
  normalizeMdiPayload,
  upsertMdiCaseSnapshot,
  upsertMdiPatientMessageSync,
} from "@/lib/mdi-client";
import {
  isUuidLike,
  isUsableConsultationUrl,
  stripUnusableConsultationState,
} from "@/lib/mdi-shared";
import { prisma } from "@/lib/prisma";
import { buildFulfillmentProjection } from "@/lib/order-workflow";
import { NextResponse } from "next/server";

function parseJsonResponse(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/create-consultation
 *
 * Creates or refreshes a consultation launch for an order.
 * The current frontend contract stays intact, but order/user MDI state
 * is now persisted separately from consultation-only fields.
 */
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    orderId,
    patientId: patientIdFromBody,
    caseId: caseIdFromBody,
    refreshAuth = false,
  } = body || {};

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  let order = await ensureMdiPartnerIdentifiers(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (order.telehealthProvider && order.telehealthProvider !== "MDI") {
    return NextResponse.json(
      {
        error: "This order uses a non-MDI telehealth provider.",
        telehealthProvider: order.telehealthProvider,
      },
      { status: 400 },
    );
  }

  const config = getMdiConfig();
  const isSandboxRuntime =
    process.env.MD_IS_SANDBOX === "true" ||
    request.nextUrl.hostname !== "healsend.com";
  const hasExistingConsultation =
    order.consultationId &&
    isUsableConsultationUrl(order.consultationUrl, {
      allowLocalFallback: config.localDevFallback,
    });

  if (hasExistingConsultation && !refreshAuth) {
    return NextResponse.json({
      consultationId: order.consultationId,
      consultationUrl: ensureMdiFullscreenUrl(order.consultationUrl),
      consultationStatus: order.consultationStatus,
      verificationCode: null,
      alreadyExists: true,
    });
  }

  let mdiAccessToken = null;
  const ensureAccessToken = async () => {
    if (!mdiAccessToken) {
      mdiAccessToken = await getMdiAccessToken({
        baseUrl: config.baseUrl,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      });
    }
    return mdiAccessToken;
  };

  const applyNormalizedMdiState = async (
    normalized,
    { touchConsultationRefresh = false } = {},
  ) => {
    const orderData = buildOrderMdiUpdate(normalized, {
      touchConsultationRefresh:
        touchConsultationRefresh || Boolean(normalized.consultationUrl),
      fallbackConsultationId: true,
    });
    orderData.mdiOrderStatus =
      orderData.mdiOrderStatus || order.mdiOrderStatus || "submitted";
    orderData.mdiWorkflowPhase =
      orderData.mdiWorkflowPhase ||
      (orderData.consultationUrl
        ? "intake_pending"
        : order.mdiWorkflowPhase || "submitted");
    orderData.consultationStatus =
      orderData.consultationStatus ||
      (orderData.consultationUrl
        ? "pending"
        : order.consultationStatus || "pending");
    if (!orderData.mdiOrderTag && orderData.consultationUrl) {
      orderData.mdiOrderTag = "Pending";
    }
    if (!orderData.mdiSubmittedAt) {
      orderData.mdiSubmittedAt = order.mdiSubmittedAt || new Date();
    }

    const userData = buildUserMdiUpdate(normalized);

    await prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: order.userId },
          data: userData,
        });
      }

      const projectedOrder = await tx.order.update({
        where: { id: orderId },
        data: orderData,
      });

      const { update: fulfillmentUpdate } =
        buildFulfillmentProjection(projectedOrder);
      if (Object.keys(fulfillmentUpdate).length > 0) {
        await tx.order.update({
          where: { id: orderId },
          data: fulfillmentUpdate,
        });
      }

      await upsertMdiPatientMessageSync(tx, normalized, order.userId);
      await upsertMdiCaseSnapshot(tx, normalized, { order });
    });

    return stripUnusableConsultationState(
      await prisma.order.findUnique({ where: { id: orderId } }),
      {
        allowLocalFallback: config.localDevFallback,
      },
    );
  };

  const hydrateFromVouchers = async () => {
    const voucherLookup = await waitForMdiOrderVouchers({
      accessToken: await ensureAccessToken(),
      orderIdentifiers: [
        order.mdiPartnerOrderId,
        order.orderNumber,
        order.id,
        order.mdiOrderId,
      ],
      baseUrl: config.baseUrl,
      attempts: refreshAuth ? 1 : 3,
      delayMs: refreshAuth ? 0 : 1200,
    });

    if (!voucherLookup?.payload) {
      return null;
    }

    const normalized = normalizeMdiPayload({
      event_type: "mdi_vouchers_loaded",
      vouchers: voucherLookup.payload,
    });

    return applyNormalizedMdiState(normalized, {
      touchConsultationRefresh: Boolean(normalized.consultationUrl),
    });
  };

  let resolvedPatientId = isUuidLike(patientIdFromBody)
    ? patientIdFromBody
    : isUuidLike(order.user?.mdiPatientId)
      ? order.user.mdiPatientId
      : isUuidLike(config.defaultPatientId)
        ? config.defaultPatientId
        : null;
  const resolvedCaseId = caseIdFromBody || order.mdiCaseId || null;

  if (!refreshAuth) {
    try {
      const voucherBackfill = await hydrateFromVouchers();
      if (voucherBackfill?.consultationUrl) {
        return NextResponse.json({
          consultationId: voucherBackfill.consultationId,
          consultationUrl: voucherBackfill.consultationUrl,
          consultationStatus: voucherBackfill.consultationStatus,
          verificationCode: null,
        });
      }
    } catch (err) {
      console.warn("Unable to hydrate MD vouchers before auth:", err);
    }
  }

  if (!resolvedPatientId && order.user?.email) {
    try {
      resolvedPatientId = await findMdiPatientByEmail({
        email: order.user.email,
        accessToken: await ensureAccessToken(),
        baseUrl: config.baseUrl,
        isSandbox: isSandboxRuntime,
      });
    } catch (err) {
      console.warn("Unable to resolve MD patient by email:", err);
    }
  }

  if ((!config.webhookIsDirectEndpoint || refreshAuth) && resolvedPatientId) {
    try {
      const messagingAuth = await getMdiMessagingAuth({
        accessToken: await ensureAccessToken(),
        patientId: resolvedPatientId,
        caseId: resolvedCaseId,
        baseUrl: config.baseUrl,
      });

      const normalized = normalizeMdiPayload({
        patient_id: resolvedPatientId,
        case_id: messagingAuth.caseId,
        consultation_url: messagingAuth.consultationUrl,
        consultation_status: "ready",
        verification_code: messagingAuth.verificationCode,
      });

      const orderData = buildOrderMdiUpdate(normalized, {
        touchConsultationRefresh: true,
        fallbackConsultationId: true,
      });
      orderData.mdiWorkflowPhase =
        orderData.mdiWorkflowPhase || "consultation_ready";
      orderData.consultationStatus = orderData.consultationStatus || "ready";

      const userData = buildUserMdiUpdate(normalized);

      await prisma.$transaction(async (tx) => {
        if (Object.keys(userData).length > 0) {
          await tx.user.update({
            where: { id: order.userId },
            data: userData,
          });
        }

        const projectedOrder = await tx.order.update({
          where: { id: orderId },
          data: orderData,
        });

        const { update: fulfillmentUpdate } =
          buildFulfillmentProjection(projectedOrder);
        if (Object.keys(fulfillmentUpdate).length > 0) {
          await tx.order.update({
            where: { id: orderId },
            data: fulfillmentUpdate,
          });
        }

        await upsertMdiPatientMessageSync(tx, normalized, order.userId);
        await upsertMdiCaseSnapshot(tx, normalized, { order });
      });

      const updatedOrder = stripUnusableConsultationState(
        await prisma.order.findUnique({ where: { id: orderId } }),
        {
          allowLocalFallback: config.localDevFallback,
        },
      );

      return NextResponse.json({
        consultationId: updatedOrder?.consultationId,
        consultationUrl: updatedOrder?.consultationUrl,
        consultationStatus: updatedOrder?.consultationStatus,
        verificationCode: messagingAuth.verificationCode,
      });
    } catch (err) {
      if (!config.webhookIsDirectEndpoint) {
        console.error("MD partner auth flow failed:", err);
        return NextResponse.json(
          {
            error:
              "Unable to create MD messaging session. Configure MD_PATIENT_ID or a full MD_WEBHOOK_URL endpoint.",
          },
          { status: 502 },
        );
      }
      console.warn(
        "MD partner auth flow failed, falling back to webhook:",
        err,
      );
    }
  }

  if (!config.webhookIsDirectEndpoint) {
    if (config.localDevFallback) {
      const localConsultationUrl = getLocalFallbackConsultationUrl(
        request.nextUrl.origin,
        orderId,
      );
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          consultationId: order.consultationId || `local-${orderId}`,
          consultationUrl: localConsultationUrl,
          consultationStatus: "ready",
          mdiWorkflowPhase: "local_dev_consultation",
          mdiConsultationRefreshedAt: new Date(),
        },
      });

      return NextResponse.json({
        consultationId: updatedOrder.consultationId,
        consultationUrl: updatedOrder.consultationUrl,
        consultationStatus: updatedOrder.consultationStatus,
        verificationCode: "000000",
        localDevFallback: true,
      });
    }

    return NextResponse.json(
      {
        error:
          "MD integration is not fully configured. Set MD_PATIENT_ID (preferred) or use a full MD_WEBHOOK_URL endpoint path (not just the domain root).",
        code: "MD_INTEGRATION_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  try {
    const accessToken = await ensureAccessToken();
    order =
      (await hydrateMdiPatientForOrder(order, {
        accessToken,
        baseUrl: config.baseUrl,
        isSandbox: isSandboxRuntime,
      })) || order;

    if (!resolvedPatientId && isUuidLike(order.user?.mdiPatientId)) {
      resolvedPatientId = order.user.mdiPatientId;
    }

    const mdResponse = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(buildMdiOrderPayload(order)),
    });

    const responseText = await mdResponse.text();
    const mdData = parseJsonResponse(responseText);

    if (!mdResponse.ok) {
      console.error(
        "MD Integrations webhook error:",
        mdResponse.status,
        responseText,
      );

      if (config.localDevFallback) {
        const localConsultationUrl = getLocalFallbackConsultationUrl(
          request.nextUrl.origin,
          orderId,
        );
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            consultationId: order.consultationId || `local-${orderId}`,
            consultationUrl: localConsultationUrl,
            consultationStatus: "ready",
            mdiWorkflowPhase: "local_dev_consultation",
            mdiConsultationRefreshedAt: new Date(),
          },
        });

        return NextResponse.json({
          consultationId: updatedOrder.consultationId,
          consultationUrl: updatedOrder.consultationUrl,
          consultationStatus: updatedOrder.consultationStatus,
          verificationCode: "000000",
          localDevFallback: true,
        });
      }

      return NextResponse.json(
        { error: "Failed to create consultation with provider" },
        { status: 502 },
      );
    }

    let normalized = normalizeMdiPayload(mdData);
    let verificationCode = normalized.verificationCode;
    let authPatientId = isUuidLike(normalized.patientId)
      ? normalized.patientId
      : resolvedPatientId;

    if (!authPatientId && order.user?.email) {
      try {
        authPatientId = await findMdiPatientByEmail({
          email: order.user.email,
          accessToken,
          baseUrl: config.baseUrl,
          isSandbox: isSandboxRuntime,
        });
      } catch (err) {
        console.warn(
          "Unable to hydrate MD patient from email after order submit:",
          err,
        );
      }
    }

    if (!normalized.consultationUrl) {
      try {
        const voucherLookup = await waitForMdiOrderVouchers({
          accessToken,
          orderIdentifiers: [
            order.mdiPartnerOrderId,
            normalized.partnerOrderId,
            normalized.orderNumber,
            normalized.internalOrderId,
            normalized.mdiOrderId,
            order.orderNumber,
            order.id,
            order.mdiOrderId,
          ],
          baseUrl: config.baseUrl,
          attempts: 3,
          delayMs: 1200,
        });

        if (voucherLookup?.payload) {
          normalized = normalizeMdiPayload({
            ...(mdData && typeof mdData === "object" ? mdData : {}),
            vouchers: voucherLookup.payload,
          });
          authPatientId = authPatientId || normalized.patientId || null;
        }
      } catch (err) {
        console.warn("Unable to hydrate MD vouchers after order submit:", err);
      }
    }

    if (!normalized.consultationUrl) {
      try {
        const directIntake = await createDirectMdiIntakeForOrder(order, {
          accessToken,
          baseUrl: config.baseUrl,
          isSandbox: isSandboxRuntime,
        });

        if (directIntake?.normalized) {
          normalized = normalizeMdiPayload({
            ...(mdData && typeof mdData === "object" ? mdData : {}),
            patient_id:
              directIntake.normalized.patientId ||
              normalized.patientId ||
              authPatientId,
            consultation_url:
              directIntake.normalized.consultationUrl ||
              normalized.consultationUrl,
            consultation_status:
              directIntake.normalized.consultationStatus ||
              normalized.consultationStatus,
            workflow_phase:
              directIntake.normalized.workflowPhase || normalized.workflowPhase,
            voucher_code:
              directIntake.normalized.voucherCode || normalized.voucherCode,
            order_tag: directIntake.normalized.orderTag || normalized.orderTag,
            case_id: directIntake.normalized.caseId || normalized.caseId,
            encounter_id:
              directIntake.normalized.encounterId || normalized.encounterId,
          });
          authPatientId =
            authPatientId || directIntake.patientId || normalized.patientId;
        }
      } catch (err) {
        console.warn(
          "Unable to create direct MD intake after order submit:",
          err,
        );
      }
    }

    if (!normalized.consultationUrl && authPatientId) {
      try {
        const messagingAuth = await getMdiMessagingAuth({
          accessToken,
          patientId: authPatientId,
          caseId: normalized.caseId || resolvedCaseId,
          baseUrl: config.baseUrl,
        });

        normalized = normalizeMdiPayload({
          ...(mdData && typeof mdData === "object" ? mdData : {}),
          patient_id: authPatientId || normalized.patientId,
          case_id: messagingAuth.caseId || normalized.caseId,
          consultation_url: messagingAuth.consultationUrl,
          consultation_status: "ready",
          verification_code: messagingAuth.verificationCode,
        });
        verificationCode = messagingAuth.verificationCode;
      } catch (err) {
        console.warn("MD patient auth was not ready after order submit:", err);
      }
    }

    if (!normalized.consultationUrl && order.user?.mdiPartnerCustomerId) {
      try {
        const customerAuth = await getMdiCustomerAuth({
          accessToken,
          customerId: order.user.mdiPartnerCustomerId,
          baseUrl: config.baseUrl,
        });

        normalized = normalizeMdiPayload({
          ...(mdData && typeof mdData === "object" ? mdData : {}),
          patient_id: authPatientId || normalized.patientId,
          case_id: customerAuth.caseId || normalized.caseId,
          consultation_url: customerAuth.consultationUrl,
          consultation_status: "ready",
          verification_code: customerAuth.verificationCode,
        });
        verificationCode = customerAuth.verificationCode;
      } catch (err) {
        console.warn("MD customer auth was not ready after order submit:", err);
      }
    }

    if (!normalized.consultationUrl) {
      for (
        let attempt = 0;
        attempt < 3 && !normalized.consultationUrl;
        attempt += 1
      ) {
        if (!authPatientId && order.user?.email) {
          try {
            authPatientId = await findMdiPatientByEmail({
              email: order.user.email,
              accessToken,
              baseUrl: config.baseUrl,
              isSandbox: isSandboxRuntime,
            });
          } catch (err) {
            console.warn(
              "Unable to find MD patient by email while polling for auth:",
              err,
            );
          }
        }

        if (authPatientId) {
          try {
            const messagingAuth = await getMdiMessagingAuth({
              accessToken,
              patientId: authPatientId,
              caseId: normalized.caseId || resolvedCaseId,
              baseUrl: config.baseUrl,
            });

            normalized = normalizeMdiPayload({
              ...mdData,
              patient_id: authPatientId,
              case_id: messagingAuth.caseId || normalized.caseId,
              consultation_url: messagingAuth.consultationUrl,
              consultation_status: "ready",
              verification_code: messagingAuth.verificationCode,
            });
            verificationCode = messagingAuth.verificationCode;
            break;
          } catch (err) {
            if (attempt === 2) {
              console.warn(
                "MD consultation auth was not ready after order submit:",
                err,
              );
            }
          }
        }

        if (attempt < 2) {
          await sleep(1200);
        }
      }
    }

    const updatedOrder = await applyNormalizedMdiState(normalized, {
      touchConsultationRefresh: !!normalized.consultationUrl,
    });

    if (!updatedOrder?.consultationUrl) {
      return NextResponse.json({
        consultationId: null,
        consultationUrl: null,
        consultationStatus: updatedOrder?.consultationStatus || "pending",
        verificationCode,
        pendingProviderAuth: true,
      });
    }

    return NextResponse.json({
      consultationId: updatedOrder?.consultationId,
      consultationUrl: updatedOrder?.consultationUrl,
      consultationStatus: updatedOrder?.consultationStatus,
      verificationCode,
    });
  } catch (err) {
    console.error("MD Integrations webhook request failed:", err);

    if (config.localDevFallback) {
      const localConsultationUrl = getLocalFallbackConsultationUrl(
        request.nextUrl.origin,
        orderId,
      );
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          consultationId: order.consultationId || `local-${orderId}`,
          consultationUrl: localConsultationUrl,
          consultationStatus: "ready",
          mdiWorkflowPhase: "local_dev_consultation",
          mdiConsultationRefreshedAt: new Date(),
        },
      });

      return NextResponse.json({
        consultationId: updatedOrder.consultationId,
        consultationUrl: updatedOrder.consultationUrl,
        consultationStatus: updatedOrder.consultationStatus,
        verificationCode: "000000",
        localDevFallback: true,
      });
    }

    return NextResponse.json(
      { error: "Unable to reach consultation provider" },
      { status: 502 },
    );
  }
}
