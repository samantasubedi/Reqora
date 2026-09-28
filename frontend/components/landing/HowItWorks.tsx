import {
  Building2,
  ClipboardList,
  PackagePlus,
  PackageCheck,
} from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    icon: Building2,
    step: "Step 1",
    title: "Create your company or join one",
    text: "Admins create a company workspace with departments. Teammates join instantly with an email invite or a short join code — role included.",
  },
  {
    icon: PackagePlus,
    step: "Step 2",
    title: "Catalog resources + items",
    text: "Add resources (e.g. Laptop, Monitor, License) per department, then register individual items with location and status.",
  },
  {
    icon: ClipboardList,
    step: "Step 3",
    title: "Employees request in seconds",
    text: "Pick a resource, set quantity and priority, add a reason. Track pending, approved, rejected, or cancelled in My Requests.",
  },
  {
    icon: PackageCheck,
    step: "Step 4",
    title: "Approve, allocate, and track",
    text: "Managers review the queue and approve. Specific item serials get allocated to the request — nothing falls through the cracks.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          From request to allocated, in four steps
        </h2>
        <p className="mt-3 font-medium text-muted-foreground">
          Designed around your actual approval chain — not a to-do list.
        </p>
      </Reveal>

      <ol className="relative mx-auto mt-12 max-w-3xl space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[22px] before:w-px before:bg-border sm:before:left-[27px]">
        {steps.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <li className="relative flex gap-4 sm:gap-6">
              <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-sm sm:size-14">
                <item.icon className="size-5 sm:size-6" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </span>
              <div className="flex-1 rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 sm:p-6">
                <p className="text-xs font-bold tracking-widest text-primary uppercase">
                  {item.step}
                </p>
                <p className="mt-1 text-lg font-bold text-card-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
