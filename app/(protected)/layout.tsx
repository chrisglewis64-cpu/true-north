import { MorningFlowGuard } from "@/components/flow/MorningFlowGuard";

export default function ProtectedLayout({
  children,
}: LayoutProps<"/">) {
  return <MorningFlowGuard>{children}</MorningFlowGuard>;
}
