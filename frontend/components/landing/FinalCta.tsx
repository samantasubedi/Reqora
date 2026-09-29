"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { Barcode } from "./Barcode";
import { Stamp } from "./Stamp";
import { TicketDivider } from "./LedgerCard";

// Same CTA wording, ink ticket instead of emerald gradient panel.
export function FinalCta() {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal>
        <div className="relative flex overflow-hidden rounded-2xl border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-xl">
          {/* ticket stub */}
          <div
            aria-hidden
            className="relative hidden w-16 shrink-0 flex-col items-center justify-between border-r border-dashed border-[var(--paper)]/40 py-8 sm:flex"
          >
            <span className="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-background" />
            <span className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full bg-background" />
            <span className="font-ledger text-[11px] font-bold tracking-[0.3em] opacity-70 [writing-mode:vertical-rl] rotate-180">
              REQORA LEDGER · FILED
            </span>
            <span className="flex h-20 w-8 items-center justify-center overflow-hidden">
              <Barcode className="w-20 rotate-90 opacity-60 [&>span]:bg-[var(--paper)]" />
            </span>
          </div>
          <div className="relative flex-1 px-6 py-12 sm:px-12 lg:py-16">
          <div className="absolute top-6 right-6 hidden sm:block">
            <Stamp tone="pending" className="border-current text-[var(--paper)]">
              Ready when you are
            </Stamp>
          </div>
          <div className="relative max-w-2xl">
            <p className="text-[13px] font-bold opacity-70">
              REQ-NEW · entry open
            </p>
            <h2 className="font-display mt-3 text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Bring every resource request into one place
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed font-medium opacity-80">
              Create your company workspace or join your team — and stop losing
              equipment to inboxes and spreadsheets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push("/getstarted")}
                className="h-12 cursor-pointer bg-[var(--paper)] px-8 text-base font-bold text-[var(--ink)] hover:brightness-95"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="h-12 cursor-pointer border-[var(--paper)]/40 bg-transparent px-8 text-base font-semibold text-[var(--paper)] hover:bg-white/10 hover:text-[var(--paper)]"
              >
                Sign in
              </Button>
            </div>
          </div>
          <TicketDivider className="mt-10 px-0 opacity-40" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[13px] font-semibold opacity-60">
              Create workspace · Join with code · No spreadsheet export
            </p>
            <Barcode className="opacity-60 [&>span]:bg-[var(--paper)]" />
          </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
