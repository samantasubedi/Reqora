import {
  BarChart3,
  Building2,
  ClipboardList,
  MailPlus,
  ScanBarcode,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "./Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
  span?: string;
};

const features: Feature[] = [
  {
    icon: ClipboardList,
    title: "One-click requests, with context",
    text: "Employees pick a resource, set quantity and priority (low / medium / high), and add a reason. Managers never have to chase “why do you need this?”.",
    span: "sm:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Approvals that stay clear",
    text: "Managers and admins get a dedicated review queue: approve, reject with a note, or forward — with reviewer and timestamp recorded.",
  },
  {
    icon: ScanBarcode,
    title: "Item-level tracking",
    text: "Beyond counts: each unit has status (available / in use / under maintenance), location, and a link to the approved request holding it.",
  },
  {
    icon: Building2,
    title: "Built for companies + departments",
    text: "Multi-tenant by design. Users, resources, and requests are scoped to the right company and department automatically.",
  },
  {
    icon: MailPlus,
    title: "Invite in seconds",
    text: "Onboard with email invites or a short join code. Roles are assigned by the admin — no extra registration friction.",
  },
  {
    icon: BarChart3,
    title: "Dashboards per role",
    text: "Admins see distribution by type, status, and role. Managers track team queues. Employees track their own requests and holdings.",
    span: "sm:col-span-2",
  },
];

export function FeaturesBento() {
  return (
    <section id="features" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Everything a resource request touches, covered
          </h2>
          <p className="mt-3 font-medium text-muted-foreground">
            Not a generic tracker — a workflow designed around how companies
            actually hand out equipment.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.07} className={feature.span}>
              <Card className="group h-full gap-4 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base font-bold text-card-foreground sm:text-lg">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
