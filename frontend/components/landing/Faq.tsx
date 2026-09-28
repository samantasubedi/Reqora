"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
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
    a: "An admin allocates specific item units to the approved request. The items flip to in use, stay linked to that request, and return to available when released — full traceability end to end.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="text-center">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Questions, answered
        </h2>
      </Reveal>

      <div className="mt-8 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.q} delay={i * 0.04}>
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card transition-colors",
                  isOpen ? "border-primary/40" : "hover:border-primary/30"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-bold text-card-foreground sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted transition-transform duration-300",
                      isOpen && "rotate-180 bg-primary/15 text-primary"
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
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
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
    </section>
  );
}
