"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import Navbar from "@/components/others/Navbar";

type Accent = {
  card: string;
  title: string;
  icon: string;
  badge: string;
  button: string;
  beamFrom: string;
  beamTo: string;
};

type Option = {
  title: string;
  badge: string;
  description: string;
  icon: string;
  bullets: { icon: string; text: string }[];
  cta: string;
  ctaIcon: string;
  href: string;
  accent: Accent;
};

const accents: Record<"teal" | "indigo", Accent> = {
  teal: {
    card: "bg-teal-500/10 border-teal-500/40",
    title: "text-teal-700 dark:text-teal-300",
    icon: "text-teal-600 dark:text-teal-400",
    badge: "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300",
    button: "bg-teal-600 hover:bg-teal-700",
    beamFrom: "#14b8a6",
    beamTo: "#10b981",
  },
  indigo: {
    card: "bg-indigo-500/10 border-indigo-500/40",
    title: "text-indigo-700 dark:text-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-400",
    badge:
      "border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    button: "bg-indigo-600 hover:bg-indigo-700",
    beamFrom: "#6366f1",
    beamTo: "#8b5cf6",
  },
};

const options: Option[] = [
  {
    title: "Join a Company",
    badge: "Have an invite code?",
    description:
      "Use your invite code to connect with your team and pick up where they left off.",
    icon: "fluent:people-add-20-filled",
    bullets: [
      {
        icon: "mdi:shield-account",
        text: "Assigns the role designated by your administrator",
      },
      {
        icon: "mdi:account-check",
        text: "Employees submit requests; managers review and approve them",
      },
      {
        icon: "mdi:login",
        text: "Grants immediate access, no additional registration required",
      },
    ],
    cta: "Join",
    ctaIcon: "line-md:login",
    href: "/getstarted/join/join-code",
    accent: accents.teal,
  },
  {
    title: "Create a Company",
    badge: "Recommended",
    description:
      "Create a new workspace for your company and set up your team, roles, and workflow.",
    icon: "mdi:company",
    bullets: [
      {
        icon: "mdi:office-building",
        text: "Set up your company workspace from scratch",
      },
      {
        icon: "mdi:account-multiple-outline",
        text: "Define roles and permissions for your team",
      },
      {
        icon: "mdi:clipboard-flow-outline",
        text: "Configure your resource approval workflow",
      },
      {
        icon: "mdi:email-arrow-right-outline",
        text: "Invite your employees to join and collaborate",
      },
    ],
    cta: "Create",
    ctaIcon: "wordpress:create",
    href: "/getstarted/createcompany",
    accent: accents.indigo,
  },
];

const steps = ["Choose", "Set up", "Invite team"];

const OptionCard = ({ option }: { option: Option }) => {
  const { accent } = option;
  return (
    <Link href={option.href} className="group block w-full lg:flex-1">
      <Card
        className={`relative flex h-full flex-col rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${accent.card}`}
      >
        <BorderBeam
          size={250}
          borderWidth={3}
          colorFrom={accent.beamFrom}
          colorTo={accent.beamTo}
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        />
        <CardHeader>
          <span
            className={`mx-auto w-fit rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
          >
            {option.badge}
          </span>
          <CardTitle
            className={`text-center text-2xl font-bold ${accent.title}`}
          >
            {option.title}
          </CardTitle>
          <CardDescription className="text-center text-base font-medium text-foreground/70">
            {option.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-5">
          <div className="flex justify-center">
            <Icon icon={option.icon} className={`size-16 ${accent.icon}`} />
          </div>
          <ul className="space-y-3">
            {option.bullets.map((bullet) => (
              <li key={bullet.text} className="flex items-start gap-3">
                <Icon
                  icon={bullet.icon}
                  className={`mt-0.5 size-5 shrink-0 ${accent.icon}`}
                />
                <p className="text-sm text-foreground">{bullet.text}</p>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-auto">
          <span
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-lg font-semibold text-white transition-colors ${accent.button}`}
          >
            {option.cta}
            <Icon icon={option.ctaIcon} className="size-6" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const userInfo = await axios.post(`${backendUrl}/isloggedin`, null, {
          withCredentials: true,
        });
        const role = userInfo.data.role;
        if (role) {
          router.push(`/${role}/dashboard`);
          return;
        }
      } catch {
        // Not logged in - continue to the get started options.
      }
      setIsChecking(false);
    };
    getUserStatus();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[15%] h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute right-[15%] top-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How would you like to get started?
              </h1>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Join your team with an invite code, or create a brand-new
                company workspace.
              </p>
            </div>

            <ol className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  {index > 0 && (
                    <span className="h-0.5 w-6 rounded-full bg-primary sm:w-10" />
                  )}
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {step}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {isChecking ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-6 lg:flex-row">
              {options.map((option) => (
                <OptionCard key={option.title} option={option} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
