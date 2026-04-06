import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  submitOrderToOla,
  getOlaOrderDetails,
  getOlaConfig,
  getOlaAccessToken,
} from "@/lib/ola-client";
import { NextResponse } from "next/server";

/**
 * POST /api/ola/create-consultation
 *
 * Creates an OLA telehealth appointment for the given order.
 * Mirrors the MDI consultation flow but routes through OLA Portal.
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

  const { orderId } = body || {};
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // If already submitted to OLA, return existing data
  if (order.olaOrderGuid) {
    try {
      const cfg = getOlaConfig();
      const token = await getOlaAccessToken(cfg);
      const details = await getOlaOrderDetails(order.olaOrderGuid, {
        accessToken: token,
        config: cfg,
      });

      const updatedStatus =
        details.data?.status || details.status || order.olaStatus;
      const updatedRedirectUrl =
        details.data?.redirect_url ||
        details.redirect_url ||
        order.olaRedirectUrl;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          olaStatus: updatedStatus,
          olaRedirectUrl: updatedRedirectUrl,
          olaLastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        olaOrderGuid: order.olaOrderGuid,
        olaStatus: updatedStatus,
        olaRedirectUrl: updatedRedirectUrl,
        consultationStatus: updatedStatus,
        alreadyExists: true,
      });
    } catch (err) {
      // If refresh fails, return cached data
      return NextResponse.json({
        olaOrderGuid: order.olaOrderGuid,
        olaStatus: order.olaStatus,
        olaRedirectUrl: order.olaRedirectUrl,
        consultationStatus: order.olaStatus,
        alreadyExists: true,
      });
    }
  }

  // Submit new appointment to OLA
  try {
    const result = await submitOrderToOla(order, user);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        telehealthProvider: "OLA",
        olaOrderGuid: result.olaOrderGuid,
        olaUserGuid: result.olaUserGuid,
        olaStatus: result.olaStatus,
        olaRedirectUrl: result.olaRedirectUrl,
        olaLastSyncAt: result.olaLastSyncAt,
        consultationStatus: "pending",
      },
    });

    return NextResponse.json({
      olaOrderGuid: result.olaOrderGuid,
      olaStatus: result.olaStatus,
      olaRedirectUrl: result.olaRedirectUrl,
      consultationStatus: "pending",
    });
  } catch (err) {
    console.error("[OLA] create-consultation error:", err);
    return NextResponse.json(
      { error: "Failed to create OLA consultation. Please try again." },
      { status: 500 },
    );
  }
}
