import {
  BarChart3,
  Building2,
  ClipboardList,
  MailPlus,
  ScanBarcode,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Feature = {
  icon: LucideIcon;
  id: string;
  title: string;
  text: string;
};

// Same six features, reframed as ledger entries F-01…F-06.
const features: Feature[] = [
  {
    icon: ClipboardList,
    id: "F-01",
    title: "One-click requests, with context",
    text: "Employees pick a resource, set quantity and priority (low / medium / high), and add a reason. Managers never have to chase “why do you need this?”.",
  },
  {
    icon: ShieldCheck,
    id: "F-02",
    title: "Approvals that stay clear",
    text: "Managers and admins get a dedicated review queue: approve, reject with a note, or forward — with reviewer and timestamp recorded.",
  },
  {
    icon: ScanBarcode,
    id: "F-03",
    title: "Item-level tracking",
    text: "Beyond counts: each unit has status (available / in use / under maintenance), location, and a link to the approved request holding it.",
  },
  {
    icon: Building2,
    id: "F-04",
    title: "Built for companies + departments",
    text: "Multi-tenant by design. Users, resources, and requests are scoped to the right company and department automatically.",
  },
  {
    icon: MailPlus,
    id: "F-05",
    title: "Invite in seconds",
    text: "Onboard with email invites or a short join code. Roles are assigned by the admin — no extra registration friction.",
  },
  {
    icon: BarChart3,
    id: "F-06",
    title: "Dashboards per role",
    text: "Admins see distribution by type, status, and role. Managers track team queues. Employees track their own requests and holdings.",
  },
];

export function FeaturesLedger() {
  return (
    <section id="features" className="scroll-mt-24 border-b border-[var(--ledger-line)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          style="plain"
          kicker="Features"
          title={<>Everything a resource request touches, covered</>}
          lede="Not a generic tracker — a workflow designed around how companies actually hand out equipment."
        />

        <div className="mt-10 overflow-hidden rounded-xl border border-[var(--ledger-line)]">
          {features.map((feature, i) => (
            <Reveal key={feature.id} delay={(i % 3) * 0.05}>
              <div className="grid gap-3 border-b border-[var(--ledger-line)] bg-[var(--paper-card)] p-5 transition-colors last:border-0 hover:bg-[var(--paper)] sm:grid-cols-[88px_40px_1fr_1.4fr] sm:items-center sm:gap-5 sm:p-6">
                <span className="font-ledger text-xs font-bold tracking-[0.2em] text-[var(--stamp)]">
                  {feature.id}
                </span>
                <span className="hidden size-10 items-center justify-center rounded-lg border border-[var(--ledger-line)] text-[var(--stamp)] sm:flex">
                  <feature.icon className="size-5" />
                </span>
                <p className="font-display text-base leading-snug font-semibold text-foreground sm:text-lg">
                  {feature.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
