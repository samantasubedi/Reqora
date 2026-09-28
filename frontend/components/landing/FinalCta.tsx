"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function FinalCta() {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 py-14 text-center shadow-xl sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]"
          />
          <div className="relative">
            <p className="text-sm font-bold tracking-widest text-emerald-50/90 uppercase">
              Ready when you are
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              Bring every resource request into one place
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-medium text-emerald-50/90">
              Create your company workspace or join your team — and stop losing
              equipment to inboxes and spreadsheets.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/getstarted")}
                className="h-12 cursor-pointer bg-white px-8 text-base font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="h-12 cursor-pointer border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
