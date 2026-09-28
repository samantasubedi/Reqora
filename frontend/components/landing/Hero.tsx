"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  Clock3,
  MapPin,
  MapPinned,
  PackageCheck,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type HeroProps = {
  loggedIn: boolean;
  role: string;
};

export function Hero({ loggedIn, role }: HeroProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handlePrimary = () => {
    if (loggedIn && role) {
      router.push(`/${role}/dashboard`);
      return;
    }
    if (loggedIn && !role) {
      router.push("/getstarted");
      return;
    }
    router.push("/getstarted");
  };

  const scrollToHow = () => {
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* backdrop: soft grid + emerald glows, works in light/dark */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute top-64 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20 lg:pb-24">
        {/* Copy */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.65, 0.35, 1] }}
        >
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Resource request platform for modern teams
          </Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Every resource request,{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              tracked to delivery.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base font-medium text-muted-foreground sm:text-lg">
            Reqora gives employees one place to request, managers one-click
            approvals, and admins item-level visibility across companies and
            departments. No lost emails. No mystery laptops.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={handlePrimary}
              className="h-12 cursor-pointer border-0 bg-gradient-to-r from-emerald-500 to-teal-600 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToHow}
              className="h-12 cursor-pointer px-7 text-base font-semibold"
            >
              <PlayCircle className="size-4" />
              See how it works
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              Role-based approvals
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              Item-level tracking
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              Department workspaces
            </li>
          </ul>
        </motion.div>

        {/* Product mock */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.65, 0.35, 1] }}
          className="relative"
        >
          <div className="relative rounded-2xl border bg-card p-5 shadow-xl shadow-primary/10 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Live request
                </p>
                <p className="mt-1 text-lg font-bold text-card-foreground">
                  MacBook Pro 16&quot; × 2
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Engineering · Floor 3 store
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-[var(--status-pending-border)]">
                  <Clock3 className="size-3" />
                  Pending
                </Badge>
                <Badge
                  variant="outline"
                  className="border-destructive/30 text-destructive"
                >
                  High priority
                </Badge>
              </div>
            </div>

            {/* timeline */}
            <ol className="mt-6 space-y-0">
              {[
                { label: "Requested by Priya · qty 2 · reason attached", done: true },
                { label: "Manager review · one-click approve", done: true },
                { label: "Admin allocates items · serials assigned", done: false },
              ].map((step, i) => (
                <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < 2 && (
                    <span
                      aria-hidden
                      className="absolute top-6 left-[11px] h-[calc(100%-1.25rem)] w-px bg-border"
                    />
                  )}
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-primary text-primary-foreground"
                        : "border border-dashed border-primary/50 bg-primary/10 text-primary"
                    }`}
                  >
                    {step.done ? (
                      <BadgeCheck className="size-3.5" />
                    ) : (
                      <CircleDashed className="size-3.5" />
                    )}
                  </span>
                  <p className="pt-0.5 text-sm font-medium text-card-foreground/90">
                    {step.label}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Available", value: "18", dot: "bg-emerald-500" },
                { label: "In use", value: "42", dot: "bg-sky-500" },
                { label: "Maintenance", value: "3", dot: "bg-amber-500" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-background px-3 py-2.5"
                >
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    <span className={`size-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <Button className="flex-1 cursor-pointer font-semibold">
                Approve & allocate
              </Button>
              <Button variant="outline" className="flex-1 cursor-pointer font-semibold">
                View details
              </Button>
            </div>
          </div>

          {/* floating chips */}
          <div className="absolute -top-4 -right-2 hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold shadow-lg sm:flex">
            <PackageCheck className="size-3.5 text-primary" />
            Allocated to REQ-2041
          </div>
          <div className="absolute -bottom-4 -left-2 hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold shadow-lg sm:flex">
            <MapPinned className="size-3.5 text-primary" />
            Floor 3 store · audited
          </div>
        </motion.div>
      </div>
    </section>
  );
}
