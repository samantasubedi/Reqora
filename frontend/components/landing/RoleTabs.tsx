"use client";

import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "./Reveal";

const roles = [
  {
    value: "employee",
    label: "Employee",
    headline: "Request what you need, know where it stands",
    points: [
      "Browse the company resource catalog by department",
      "Submit quantity + priority + reason in one form",
      "Track My Requests: pending, approved, rejected, cancelled",
      "See items currently allocated to you and where to collect them",
    ],
    footer: "No emails to chase. No guessing who approved.",
  },
  {
    value: "manager",
    label: "Manager",
    headline: "Clear the queue without the chaos",
    points: [
      "Review queue scoped to your team and departments",
      "Approve or reject with a note — one click, fully recorded",
      "Check resource availability before you decide",
      "Keep request history for audits and handovers",
    ],
    footer: "Everyone stays in the loop, automatically.",
  },
  {
    value: "admin",
    label: "Admin",
    headline: "Run the whole operation with confidence",
    points: [
      "Manage companies, departments, users, and roles",
      "Catalog resources and register each item with status + location",
      "Allocate specific items to approved requests",
      "Monitor distribution by type, status, and role from dashboards",
    ],
    footer: "Invite via email or join code. Scale team by team.",
  },
] as const;

export function RoleTabs() {
  return (
    <section id="roles" className="scroll-mt-24 border-y bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Built for every role
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            One platform, three focused workspaces
          </h2>
          <p className="mt-3 font-medium text-muted-foreground">
            Each role sees exactly what it needs — nothing more, nothing missing.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Tabs defaultValue="employee" className="mx-auto max-w-4xl">
            <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
              {roles.map((r) => (
                <TabsTrigger key={r.value} value={r.value} className="cursor-pointer font-semibold">
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {roles.map((r) => (
              <TabsContent
                key={r.value}
                value={r.value}
                className="mt-6 rounded-2xl border bg-background p-6 shadow-sm sm:p-8"
              >
                <p className="text-xl font-bold text-foreground sm:text-2xl">
                  {r.headline}
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {r.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm font-medium text-foreground/90">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-sm font-semibold text-muted-foreground">
                  {r.footer}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
