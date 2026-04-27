import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soul-Sync Quiz — WedInviter",
  description:
    "Take the Soul-Sync quiz challenge and discover your connection score! Built with love by WedInviter.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
