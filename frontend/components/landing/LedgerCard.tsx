import { cn } from "@/lib/utils";

export function LedgerCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ledger-card-flat rounded-xl border border-[var(--ledger-line)] shadow-[0_1px_0_var(--ledger-line),0_12px_32px_-16px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TicketDivider({
  className,
  notchClassName = "bg-background",
}: {
  className?: string;
  notchClassName?: string;
}) {
  return (
    <div className={cn("relative px-5", className)} aria-hidden>
      <div className="ticket-perforation-x w-full" />
      <span
        className={cn(
          "absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full border border-[var(--ledger-line)]",
          notchClassName
        )}
      />
      <span
        className={cn(
          "absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full border border-[var(--ledger-line)]",
          notchClassName
        )}
      />
    </div>
  );
}

// Full-bleed perforation strip used as page architecture between sections —
// the ticket motif promoted from card decoration to brand identity.
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("bg-background py-1", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ticket-perforation-x w-full opacity-80" />
      </div>
    </div>
  );
}

export function AuditRow({
  time,
  actor,
  action,
  tone = "text-foreground",
}: {
  time: string;
  actor: string;
  action: string;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline gap-3 border-b border-dashed border-[var(--ledger-line)] py-2.5 font-medium last:border-0">
      <span className="font-ledger w-20 shrink-0 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {time}
      </span>
      <p className={cn("text-sm leading-relaxed", tone)}>
        <span className="font-bold">{actor}</span>{" "}
        <span className="text-muted-foreground">{action}</span>
      </p>
    </div>
  );
}
