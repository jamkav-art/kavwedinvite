import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/types/database.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature header" },
        { status: 400 },
      );
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    const isValid = verifyRazorpayWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!event || !paymentEntity) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Find order by razorpay_payment_id or razorpay_order_id
    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;

    let orderId: string | null = null;
    let orderStatus: OrderStatus | null = null;

    if (razorpayPaymentId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("razorpay_payment_id", razorpayPaymentId)
        .single();

      if (order) {
        orderId = order.id;
        orderStatus = order.status;
      }
    }

    if (!orderId && razorpayOrderId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      if (order) {
        orderId = order.id;
        orderStatus = order.status;
      }
    }

    if (!orderId) {
      console.warn("Webhook received for unknown payment:", razorpayPaymentId);
      // Still return 200 to avoid Razorpay retries
      return NextResponse.json({
        success: true,
        message: "Order not found, ignoring",
      });
    }

    // Update order status based on event
    let newStatus: OrderStatus | null = null;
    if (event === "payment.captured") {
      newStatus = "paid";
    } else if (event === "payment.failed") {
      newStatus = "pending"; // or keep as pending? maybe 'failed' but we don't have that status
    } else {
      // For other events, we can log and ignore
      console.log(`Webhook event ${event} received for order ${orderId}`);
      return NextResponse.json({ success: true, message: "Event ignored" });
    }

    if (newStatus && newStatus !== orderStatus) {
      await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
