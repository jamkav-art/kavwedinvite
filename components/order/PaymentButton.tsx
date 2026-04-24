"use client";

import { Button } from "@/components/ui/Button";

interface PaymentButtonProps {
  disabledReason?: string | null;
  loading?: boolean;
  onClick: () => Promise<void> | void;
}

export default function PaymentButton({
  disabledReason,
  loading = false,
  onClick,
}: PaymentButtonProps) {
  const disabled = Boolean(disabledReason) || loading;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size="lg"
        loading={loading}
        disabled={disabled}
        onClick={() => void onClick()}
        title={disabledReason ?? undefined}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[--color-charcoal] via-[#414141] to-black hover:brightness-110 shadow-lg shadow-black/10"
      >
        {loading ? "Preparing payment..." : "Pay ₹399 Securely"}
      </Button>
      {disabledReason && (
        <p className="text-xs text-[--color-terracotta]">{disabledReason}</p>
      )}
    </div>
  );
}
