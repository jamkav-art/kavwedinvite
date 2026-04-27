"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnniversaryOrderState } from "@/types/anniversary-order.types";
import type { QuizConfigItem } from "@/types/anniversary-quiz.types";
import { ANNIVERSARY_PRICE } from "@/lib/anniversary-constants";

interface CreateResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

interface VerifyResponse {
  success: boolean;
  quizId?: string;
  quizUrl?: string;
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

export function useAnniversaryPayment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = useCallback(
    async (orderData: AnniversaryOrderState, quizConfig?: QuizConfigItem[]) => {
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
            amount: ANNIVERSARY_PRICE,
            currency: "INR",
            productType: "anniversary-quiz",
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

        const enabledQuestions = orderData.questions.filter((q) => q.enabled);
        const questionCount = enabledQuestions.length;

        const rzp = new window.Razorpay({
          key,
          amount: createPayload.amount ?? ANNIVERSARY_PRICE * 100,
          currency: createPayload.currency ?? "INR",
          name: "WedInviter",
          description: `Anniversary Quiz (${questionCount} questions)`,
          order_id: createPayload.orderId,
          prefill: {
            name: `${orderData.yourName} & ${orderData.partnerName}`,
            email: orderData.email,
            contact: orderData.phone,
          },
          theme: { color: "#c0185f" },
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
                  quizConfig,
                  productType: "anniversary-quiz",
                }),
              });

              const verifyPayload = (await verifyRes.json()) as VerifyResponse;
              if (!verifyRes.ok || !verifyPayload.success) {
                throw new Error(
                  verifyPayload.error ?? "Payment verification failed.",
                );
              }

              const successParams = new URLSearchParams({
                id: verifyPayload.quizId ?? "",
                name1: orderData.yourName,
                name2: orderData.partnerName,
              });
              router.push(
                `/wed-anniversary-wish/success?${successParams.toString()}`,
              );
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
