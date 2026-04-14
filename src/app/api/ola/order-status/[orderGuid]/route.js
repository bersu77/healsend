import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getOlaOrderDetails,
  getOlaServiceDetails,
  resolveOlaConfig,
  getOlaAccessToken,
} from "@/lib/ola-client";
import { NextResponse } from "next/server";

/**
 * GET /api/ola/order-status/[orderGuid]
 *
 * Fetches the latest OLA order/service details and syncs them back to our DB.
 */
export async function GET(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { orderGuid } = await params;
  if (!orderGuid) {
    return NextResponse.json(
      { error: "orderGuid is required" },
      { status: 400 },
    );
  }

  const order = await prisma.order.findFirst({
    where: { olaOrderGuid: orderGuid, userId: user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const cfg = await resolveOlaConfig();
    const token = await getOlaAccessToken(cfg);

    const [orderDetails, serviceDetails] = await Promise.all([
      getOlaOrderDetails(orderGuid, { accessToken: token, config: cfg }),
      getOlaServiceDetails(orderGuid, {
        accessToken: token,
        config: cfg,
      }).catch(() => null),
    ]);

    const status =
      orderDetails.data?.status || orderDetails.status || order.olaStatus;
    const redirectUrl =
      orderDetails.data?.redirect_url ||
      orderDetails.redirect_url ||
      order.olaRedirectUrl;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        olaStatus: status,
        olaRedirectUrl: redirectUrl,
        olaLastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      olaOrderGuid: orderGuid,
      olaStatus: status,
      olaRedirectUrl: redirectUrl,
      orderDetails: orderDetails.data || orderDetails,
      serviceDetails: serviceDetails?.data || serviceDetails || null,
    });
  } catch (err) {
    console.error("[OLA] order-status error:", err);
    return NextResponse.json(
      { error: "Failed to fetch OLA order status." },
      { status: 500 },
    );
  }
}
