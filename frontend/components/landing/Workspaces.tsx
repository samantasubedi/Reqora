"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { LedgerCard, TicketDivider } from "./LedgerCard";
import { Stamp } from "./Stamp";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "employee",
    label: "Employee",
    code: "EMP",
    headline: "Request what you need, know where it stands",
    points: [
      "Browse the company resource catalog by department",
      "Submit quantity + priority + reason in one form",
      "Track My Requests: pending, approved, rejected, cancelled",
      "See items currently allocated to you and where to collect them",
    ],
    footer: "No emails to chase. No guessing who approved.",
    shot: "/Employee.png",
    shotAlt: "Employee workspace showing recent requests with approved and rejected statuses and a request status chart",
    stamp: "On record",
  },
  {
    value: "manager",
    label: "Manager",
    code: "MGR",
    headline: "Clear the queue without the chaos",
    points: [
      "Review queue scoped to your team and departments",
      "Approve or reject with a note — one click, fully recorded",
      "Check resource availability before you decide",
      "Keep request history for audits and handovers",
    ],
    footer: "Everyone stays in the loop, automatically.",
    shot: "/manager.png",
    shotAlt: "Manager review queue with five pending requests, each showing requester, item, reason, and approve or reject actions",
    stamp: "5 pending review",
  },
  {
    value: "admin",
    label: "Admin",
    code: "ADM",
    headline: "Run the whole operation with confidence",
    points: [
      "Manage companies, departments, users, and roles",
      "Catalog resources and register each item with status + location",
      "See exactly which serials the system auto-assigned to each request",
      "Monitor distribution by type, status, and role from dashboards",
    ],
    footer: "Invite via email or join code. Scale team by team.",
    shot: "/Admin.png",
    shotAlt: "Admin dashboard with resource overview counts and distribution charts",
    stamp: "112 items audited",
  },
] as const;

// One tabbed viewer with real screenshots — no placeholders.
export function Workspaces() {
  const [active, setActive] = useState<(typeof roles)[number]["value"]>("employee");
  const current = roles.find((r) => r.value === active) ?? roles[0];

  return (
    <section id="roles" className="scroll-mt-24 border-b border-[var(--ledger-line)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          style="ticket"
          kicker="Built for every role"
          title={<>One platform, three focused workspaces</>}
          lede="Each role sees exactly what it needs — nothing more, nothing missing."
        />

        <Reveal delay={0.1} className="mt-10">
          <div
            role="tablist"
            aria-label="Workspaces by role"
            className="flex flex-wrap gap-2"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                role="tab"
                aria-selected={active === r.value}
                onClick={() => setActive(r.value)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-[13px] font-bold transition-colors",
                  active === r.value
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--ledger-line)] bg-[var(--paper-card)] text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <LedgerCard key={current.value} className="mt-6 overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_1.2fr]">
              <div className="p-6 sm:p-8">
                <p className="text-[13px] font-bold text-[var(--stamp)]">
                  {current.code} workspace
                </p>
                <p className="font-display mt-2 text-2xl leading-tight font-semibold text-foreground">
                  {current.headline}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {current.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed font-medium text-foreground/90"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--stamp)]/40 text-[var(--stamp)]">
                        <Check className="size-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-l-2 border-[var(--stamp)] bg-[var(--paper)] px-3 py-2 text-[13px] leading-relaxed font-semibold text-muted-foreground">
                  {current.footer}
                </p>
              </div>

              <div className="relative border-t border-[var(--ledger-line)] bg-[var(--paper)] p-4 lg:border-t-0 lg:border-l">
                <div className="absolute top-6 right-6 z-10">
                  <Stamp tone="success">{current.stamp}</Stamp>
                </div>
                <div className="overflow-hidden rounded-lg border border-[var(--ledger-line)]">
                  <Image
                    src={current.shot}
                    alt={current.shotAlt}
                    width={1600}
                    height={1000}
                    className="h-auto w-full"
                  />
                </div>
                <TicketDivider className="mt-4 px-0" />
                <p className="mt-3 text-center text-[13px] font-semibold text-muted-foreground">
                  Live visibility — no spreadsheet export
                </p>
              </div>
            </div>
          </LedgerCard>
        </Reveal>
      </div>
    </section>
  );
}
