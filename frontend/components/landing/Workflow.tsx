import { Building2, ClipboardList, PackageCheck, PackagePlus } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

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
    title: "Approve once — tracking starts instantly",
    text: "Managers review the queue and approve. The system instantly assigns the oldest available serials to the request and flips them to in use — nothing falls through the cracks.",
  },
];

// Same 4-step wording, horizontal stamp rail instead of vertical timeline.
export function Workflow() {
  return (
    <section
      id="how"
      className="scroll-mt-24 border-y border-[var(--ledger-line)] bg-[var(--paper-card)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          style="chip"
          kicker="How it works"
          title={<>From request to allocated, in four steps</>}
          lede="Designed around your actual approval chain — not a to-do list."
        />

        <ol className="relative mt-12 grid gap-5 md:grid-cols-4">
          <div
            aria-hidden
            className="absolute top-7 right-8 left-8 hidden border-t-2 border-dashed border-[var(--ledger-line)] md:block"
          />
          {steps.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <li className="relative rounded-xl border border-[var(--ledger-line)] bg-[var(--paper)] p-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-lg border border-[var(--ledger-line)] bg-[var(--paper-card)] text-[var(--stamp)]">
                    <item.icon className="size-5" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-[var(--ledger-line)] italic">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-4 text-[13px] font-bold text-[var(--stamp)]">
                  {item.step}
                </p>
                <p className="font-display mt-1 text-lg leading-snug font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
