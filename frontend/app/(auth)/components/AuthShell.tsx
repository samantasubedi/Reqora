"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "@/components/others/Navbar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/landing/Reveal";

const brandPoints = [
  {
    title: "One queue for every request",
    text: "Employees request, managers approve, admins allocate — nothing lost in inboxes.",
  },
  {
    title: "Item-level truth",
    text: "Each unit tracked as available, in use, or under maintenance, with location.",
  },
  {
    title: "Join in minutes",
    text: "Create a workspace as admin or join your team with a code or email invite.",
  },
];

type AuthShellProps = {
  badge: string;
  title: ReactNode;
  subtitle: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
  children: ReactNode;
};

export function AuthShell({
  badge,
  title,
  subtitle,
  switchPrompt,
  switchLabel,
  switchHref,
  children,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* Brand panel */}
            <Reveal className="hidden lg:block">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-8 shadow-sm">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-primary/[0.04] to-teal-500/10"
                />
                <div className="relative">
                  <span className="inline-flex items-center rounded-xl bg-primary/10 px-3 py-2">
                    <Image
                      src="/reqoraLogo.png"
                      width={140}
                      height={40}
                      alt="Reqora"
                      className="h-8 w-auto"
                    />
                  </span>
                  <p className="mt-6 text-2xl font-bold tracking-tight text-balance text-card-foreground">
                    Resource requests, tracked to delivery.
                  </p>
                  <p className="mt-2 font-medium text-muted-foreground">
                    The request platform for modern teams.
                  </p>
                  <ul className="mt-8 space-y-5">
                    {brandPoints.map((point) => (
                      <li key={point.title} className="flex gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="size-3.5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-card-foreground">
                            {point.title}
                          </span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                            {point.text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Form card */}
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <Badge
                  variant="secondary"
                  className="w-fit gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  {badge}
                </Badge>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-balance text-card-foreground sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 font-medium text-muted-foreground">{subtitle}</p>

                <div className="mt-6 flex-1">{children}</div>

                <p className="mt-6 border-t pt-5 text-center text-sm font-medium text-muted-foreground">
                  {switchPrompt}{" "}
                  <Link
                    href={switchHref}
                    className="font-bold text-primary hover:underline"
                  >
                    {switchLabel}
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
