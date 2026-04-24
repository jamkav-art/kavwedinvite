import { NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";

interface CreateOrderRequest {
  amount: number;
  currency: string;
}

interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateOrderRequest>;
    const amount = Number(body.amount);
    const currency = body.currency?.toUpperCase();

    if (!Number.isFinite(amount) || amount !== 399) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Expected 399 INR." },
        { status: 400 },
      );
    }

    if (currency !== "INR") {
      return NextResponse.json(
        { success: false, error: "Invalid currency. Expected INR." },
        { status: 400 },
      );
    }

    const razorpay = getRazorpayInstance();
    // Razorpay SDK types return `Promise<RazorpayOrder> & void` — cast to resolve correctly
    const order = await (razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `wed-${Date.now()}`,
      payment_capture: true,
    }) as unknown as Promise<RazorpayOrderResult>);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    // Razorpay SDK throws plain objects, not Error instances
    let message = "Failed to create Razorpay order.";
    if (error instanceof Error) {
      message = error.message;
    } else if (
      error !== null &&
      typeof error === "object" &&
      "error" in error &&
      error.error !== null &&
      typeof error.error === "object" &&
      "description" in error.error
    ) {
      message = String((error.error as { description: unknown }).description);
    }
    console.error("[Razorpay create]", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
