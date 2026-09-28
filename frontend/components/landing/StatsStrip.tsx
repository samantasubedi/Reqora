import { Building2, Layers3, ScanBarcode, Workflow } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: Workflow,
    title: "3 role-based workflows",
    text: "Employee requests, manager approvals, admin oversight — each with its own dashboard.",
  },
  {
    icon: Building2,
    title: "Company → Department scoping",
    text: "Resources, users, and requests stay correctly scoped by company and department.",
  },
  {
    icon: ScanBarcode,
    title: "Item-level truth",
    text: "Every unit tracked with status, location, and which approved request holds it.",
  },
  {
    icon: Layers3,
    title: "Priority + full audit trail",
    text: "Low / medium / high priority with requester, reviewer, notes, and history.",
  },
];

export function StatsStrip() {
  return (
    <section className="border-y bg-card">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-card-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
