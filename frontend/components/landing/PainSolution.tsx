import { ArrowRight, CircleX, PartyPopper, X } from "lucide-react";
import { Reveal } from "./Reveal";

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

export function PainSolution() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">
          Why Reqora
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Stop running resources on hope and spreadsheets
        </h2>
        <p className="mt-3 font-medium text-muted-foreground">
          The old way loses equipment. Reqora keeps every request accountable.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-destructive/25 bg-[var(--status-danger-bg)] p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-[var(--status-danger-text)]">
              <CircleX className="size-4" />
              Before Reqora
            </p>
            <ul className="mt-5 space-y-4">
              {before.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-[var(--status-danger-border)] bg-background/60 p-3.5 text-sm font-medium text-foreground"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-primary/30 bg-[var(--status-success-bg)] p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-[var(--status-success-text)]">
              <PartyPopper className="size-4" />
              With Reqora
            </p>
            <ul className="mt-5 space-y-4">
              {after.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-[var(--status-success-border)] bg-background/70 p-3.5 text-sm font-medium text-foreground"
                >
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
