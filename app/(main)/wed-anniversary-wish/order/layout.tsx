import type { Metadata } from "next";
import WizardContainer from "@/components/anniversary-wizard/WizardContainer";

export const metadata: Metadata = {
  title: "Create Your Love Story Quiz | WedInviter",
  description:
    "Build a beautiful anniversary quiz for your partner. One field at a time.",
};

export default function AnniversaryOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]">
      <WizardContainer>{children}</WizardContainer>
    </div>
  );
}
