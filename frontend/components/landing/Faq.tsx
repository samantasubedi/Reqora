"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is Reqora an employee management (HR) system?",
    a: "No. Reqora is a resource management system with built-in team workflows. It manages users, roles, departments, and invites only so resource requests stay correctly scoped and approved — not payroll, attendance, or performance.",
  },
  {
    q: "How do teammates join my company?",
    a: "Two ways: send an email invite with a secure token, or share a short join code. Both carry the company, department, and role — so new members land in the right workspace immediately.",
  },
  {
    q: "Can I track individual items, not just totals?",
    a: "Yes. Each resource (e.g. Laptop) has individual items with status — available, in use, or under maintenance — plus location and a link to the approved request currently holding it.",
  },
  {
    q: "Who can approve requests?",
    a: "Managers review their team's queue and admins have full oversight. Every decision records the reviewer, timestamp, and note, and requesters can follow status from pending to allocated.",
  },
  {
    q: "What happens after approval?",
    a: "The moment a request is approved, the system instantly assigns the oldest available units to it — no second queue, no waiting on anyone. The items flip to in use, stay linked to that request with reviewer and timestamp on record, and return to available when released — full traceability end to end.",
  },
];

// Same Q/A, ruled ledger rows instead of generic cards.
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-b border-[var(--ledger-line)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          style="rule"
          kicker="FAQ"
          title={<>Questions, answered</>}
        />

        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--ledger-line)]">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={i * 0.03}>
                <div
                  className={cn(
                    "border-b border-[var(--ledger-line)] bg-[var(--paper-card)] last:border-0",
                    isOpen && "bg-[var(--paper)]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-4 p-5 text-left"
                  >
                    <span className="w-10 shrink-0 text-[13px] font-bold text-[var(--stamp)]">
                      Q{i + 1}
                    </span>
                    <span className="flex-1 text-sm font-bold text-foreground sm:text-base">
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--ledger-line)] transition-transform duration-300",
                        isOpen && "rotate-180 border-[var(--stamp)] text-[var(--stamp)]"
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.21, 0.65, 0.35, 1] }}
                      >
                        <p className="px-5 pb-5 pl-[4.5rem] font-medium text-sm leading-relaxed text-muted-foreground">
                          <span className="mr-2 text-[13px] font-bold text-[var(--stamp)]">
                            A —
                          </span>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
