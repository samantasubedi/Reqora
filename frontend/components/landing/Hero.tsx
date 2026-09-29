"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoRequest } from "./DemoRequest";
import { LedgerCard, TicketDivider } from "./LedgerCard";

type HeroProps = {
  loggedIn: boolean;
  role: string;
};

const liveCounts = [
  { label: "Available", value: "67", tone: "text-[var(--stamp)]" },
  { label: "In use", value: "40", tone: "text-sky-700 dark:text-sky-300" },
  { label: "Maintenance", value: "5", tone: "text-[var(--status-danger-text)]" },
];

const liveEntries = [
  { id: "cmuaqLp8", text: "keyboard → Approved", tone: "text-[var(--stamp)]" },
  { id: "cmuaqLq4", text: "cable → Rejected + note", tone: "text-[var(--status-danger-text)]" },
  { id: "cmun17jk", text: "mouse → Awaiting review", tone: "text-[var(--status-pending-text)]" },
];

export function Hero({ loggedIn, role }: HeroProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handlePrimary = () => {
    if (loggedIn && role) {
      router.push(`/${role}/dashboard`);
      return;
    }
    router.push("/getstarted");
  };

  return (
    <section className="relative overflow-hidden border-b border-[var(--ledger-line)]">
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.65, 0.35, 1] }}
          >
            <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-muted-foreground">
              <span className="font-ledger rounded border border-[var(--ledger-line)] bg-[var(--paper-card)] px-2 py-1 text-xs text-[var(--stamp)]">
                REQ-2041
              </span>
              The resource request platform for modern teams
            </p>

            <h1 className="font-display mt-5 text-4xl leading-[1.02] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              No lost emails.{" "}
              <em className="rounded-[3px] [background:color-mix(in_oklch,var(--stamp)_20%,transparent)] px-[0.12em] [box-decoration-break:clone] not-italic">
                No mystery laptops.
              </em>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed font-medium text-muted-foreground sm:text-lg">
              Don&apos;t take our word for it — file a request below, review it
              as the manager, then track it back as the employee. The whole
              lifecycle, in about 30 seconds.
            </p>

            <div className="mt-6">
              <Button
                size="lg"
                onClick={handlePrimary}
                className="h-12 cursor-pointer bg-[var(--stamp)] px-7 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>

          {/* proof rail — balances the composition with live ledger figures */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.65, 0.35, 1] }}
          >
            <LedgerCard className="overflow-hidden p-0">
              <div className="flex items-center justify-between gap-2 px-5 pt-4">
                <p className="text-[13px] font-bold text-foreground">
                  Live from the ledger
                </p>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--stamp)]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--stamp)] opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-[var(--stamp)]" />
                  </span>
                  TODAY
                </span>
              </div>
              <div className="px-5 pt-3">
                <p className="font-ledger text-4xl font-bold text-foreground">112</p>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                  resources tracked · 0 missing
                </p>
              </div>
              <ul className="px-5 pt-3">
                {liveCounts.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-baseline justify-between border-b border-dashed border-[var(--ledger-line)] py-2 last:border-0"
                  >
                    <span className="text-[13px] font-semibold text-muted-foreground">
                      {c.label}
                    </span>
                    <span className={`font-ledger text-lg font-bold ${c.tone}`}>
                      {c.value}
                    </span>
                  </li>
                ))}
              </ul>
              <TicketDivider />
              <ul className="space-y-2 px-5 py-4">
                {liveEntries.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-2 text-[13px]">
                    <span className="font-ledger text-xs font-semibold text-muted-foreground">
                      {e.id}
                    </span>
                    <span className={`font-semibold ${e.tone}`}>{e.text}</span>
                  </li>
                ))}
              </ul>
            </LedgerCard>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.65, 0.35, 1] }}
          className="mt-10"
        >
          <DemoRequest />
        </motion.div>
      </div>
    </section>
  );
}
