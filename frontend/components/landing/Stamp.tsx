import { cn } from "@/lib/utils";

type StampProps = {
  children: React.ReactNode;
  tone?: "success" | "pending" | "danger" | "ink";
  className?: string;
};

const tones: Record<NonNullable<StampProps["tone"]>, string> = {
  success: "text-[var(--stamp)]",
  pending: "text-[var(--status-pending-text)]",
  danger: "text-[var(--status-danger-text)]",
  ink: "text-[var(--ink)]",
};

export function Stamp({ children, tone = "success", className }: StampProps) {
  return (
    <span
      className={cn(
        "font-ledger inline-flex -rotate-6 items-center gap-1.5 rounded-[4px] border-[1.5px] border-current px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] uppercase opacity-90",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
