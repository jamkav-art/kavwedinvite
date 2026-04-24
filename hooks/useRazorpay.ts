"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderFormState } from "@/types/order.types";

interface CreateResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

interface VerifyResponse {
  success: boolean;
  inviteId?: string;
  inviteUrl?: string;
  error?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayHandlerResponse) => Promise<void>;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): {
    open: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export function useRazorpay() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = useCallback(
    async (orderData: OrderFormState) => {
      setIsLoading(true);
      try {
        if (!window.Razorpay) {
          throw new Error(
            "Razorpay SDK is not loaded. Please refresh and try again.",
          );
        }

        const createRes = await fetch("/api/razorpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 399,
            currency: "INR",
          }),
        });

        const createPayload = (await createRes.json()) as CreateResponse;
        if (!createRes.ok || !createPayload.success || !createPayload.orderId) {
          throw new Error(
            createPayload.error ?? "Failed to create payment order.",
          );
        }

        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
          throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID.");
        }

        const rzp = new window.Razorpay({
          key,
          amount: createPayload.amount ?? 39900,
          currency: createPayload.currency ?? "INR",
          name: "WedInviter",
          description: "Wedding Invitation Payment",
          order_id: createPayload.orderId,
          prefill: {
            name: `${orderData.couple_name_1} & ${orderData.couple_name_2}`,
            email: orderData.email,
            contact: orderData.phone_number,
          },
          theme: { color: "#2D2D2D" },
          modal: {
            ondismiss: () => setIsLoading(false),
          },
          handler: async (paymentResponse) => {
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...paymentResponse,
                  orderData,
                }),
              });

              const verifyPayload = (await verifyRes.json()) as VerifyResponse;
              if (
                !verifyRes.ok ||
                !verifyPayload.success ||
                !verifyPayload.inviteId
              ) {
                throw new Error(
                  verifyPayload.error ?? "Payment verification failed.",
                );
              }

              const successParams = new URLSearchParams({
                orderId: createPayload.orderId ?? "",
                inviteId: verifyPayload.inviteId,
                coupleNames: `${orderData.couple_name_1} & ${orderData.couple_name_2}`,
                weddingDate: orderData.wedding_date,
                template: orderData.template_slug,
                phone: orderData.phone_number,
                message: orderData.custom_message ?? "",
              });
              router.push(`/order/success?${successParams.toString()}`);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Payment verification failed.";
              window.alert(message);
            } finally {
              setIsLoading(false);
            }
          },
        });

        rzp.open();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to start payment.";
        window.alert(message);
        setIsLoading(false);
      }
    },
    [router],
  );

  return { initializePayment, isLoading };
}
