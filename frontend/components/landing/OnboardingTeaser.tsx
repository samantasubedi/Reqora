"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Building2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function OnboardingTeaser() {
  const router = useRouter();

  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Create a workspace or join your team today
          </h2>
          <p className="mt-3 font-medium text-muted-foreground">
            Two paths, both live in minutes. Pick the one that fits you.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-6" />
              </span>
              <p className="mt-4 text-xl font-bold text-card-foreground">
                Create a company
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Set up departments, catalog resources, and invite your team with
                email or code. You become the admin.
              </p>
              <Button
                onClick={() => router.push("/getstarted/createcompany")}
                className="mt-6 cursor-pointer font-semibold"
              >
                Create workspace
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
                <KeyRound className="size-6" />
              </span>
              <p className="mt-4 text-xl font-bold text-card-foreground">
                Join with a code
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Have an invite from your admin? Enter the join code or accept
                the email invite — your role is set automatically.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/getstarted?join=code")}
                className="mt-6 cursor-pointer font-semibold"
              >
                Enter join code
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
