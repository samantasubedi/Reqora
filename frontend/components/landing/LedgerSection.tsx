import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { LedgerCard, TicketDivider } from "./LedgerCard";
import { Stamp } from "./Stamp";
import { Barcode } from "./Barcode";

const before = [
  "Requests buried in email threads and chat messages",
  "Nobody knows who approved what, or when",
  'Spreadsheets say "12 laptops" but 3 are missing',
  "New hires wait days with no status updates",
];

const after = [
  "One catalog, one queue, one source of truth",
  "Clear approver, timestamp, and note on every decision",
  "Each item tracked: available, in use, or under maintenance",
  "Requesters see live status from pending to allocated",
];

// Before panel keeps its wording; the "after" panel now shows the real
// request audit trail instead of hand-built rows.
export function LedgerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        kicker="Why Reqora"
        title={<>Stop running resources on hope and spreadsheets</>}
        lede="The old way loses equipment. Reqora keeps every request accountable."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-xl border border-dashed border-[var(--ledger-line)] bg-[var(--paper-card)] p-6 sm:p-7">
            <p className="flex items-center justify-between text-[13px] font-bold text-muted-foreground">
              Before Reqora · inbox thread
              <span className="rounded bg-[var(--status-danger-bg)] px-2 py-0.5 text-xs text-[var(--status-danger-text)]">
                Unresolved
              </span>
            </p>
            <ul className="mt-5 space-y-3">
              {before.map((point, i) => (
                <li
                  key={point}
                  className="rounded-lg border border-[var(--ledger-line)] bg-[var(--paper)] p-3.5"
                >
                  <p className="text-xs font-semibold text-muted-foreground">
                    Re: laptops ??? · 09:{14 + i * 7} AM · +{3 + i} replies
                  </p>
                  <p className="mt-1 text-sm leading-relaxed font-medium text-foreground/90">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <LedgerCard className="relative h-full overflow-hidden p-0">
            <div className="flex items-center justify-between gap-3 px-6 pt-6 sm:px-7">
              <p className="text-[13px] font-bold text-[var(--stamp)]">
                With Reqora · ledger entry{" "}
                <span className="font-ledger text-xs">cmun17jk</span>
              </p>
              <Stamp tone="success">Filed</Stamp>
            </div>
            <div className="px-6 pt-4 sm:px-7">
              <div className="aspect-[2/1] overflow-hidden rounded-lg border border-[var(--ledger-line)]">
                <Image
                  src="/shotD.png"
                  alt="Real request audit trail: request information, timeline from submitted to decision, and activity log with timestamps"
                  width={1900}
                  height={1000}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <TicketDivider className="mt-5" />
            <ul className="grid gap-2 px-6 py-5 sm:grid-cols-2 sm:px-7">
              {after.map((point) => (
                <li
                  key={point}
                  className="text-xs leading-relaxed font-semibold text-muted-foreground"
                >
                  <span className="mr-1.5 text-[var(--stamp)]">✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 sm:px-7">
              <Barcode className="opacity-60" />
            </div>
          </LedgerCard>
        </Reveal>
      </div>
    </section>
  );
}
