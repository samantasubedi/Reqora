"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CircleHelp,
  KeyRound,
  Loader2,
  LogIn,
} from "lucide-react";
import { api } from "@/lib/apiClient";
import { Reveal } from "@/components/landing/Reveal";
import { GetStartedShell } from "./components/GetStartedShell";
import { PathCard } from "./components/PathCard";
import { JoinCodeModal } from "./components/JoinCodeModal";

const helperFaqs = [
  {
    q: "Do I need an account first?",
    a: "Yes — sign in (or register) first, then create or join. If you try either while signed out, we'll send you to login.",
  },
  {
    q: "Where do I find my join code?",
    a: "Your admin generates it from their dashboard and shares it directly, or sends you an email invite you can accept in one click.",
  },
  {
    q: "What happens after I join?",
    a: "You land in your role's dashboard — employees request, managers approve, admins run the workspace.",
  },
];

const Page = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  // Deep link support: /getstarted?join=code requests the join modal.
  const [joinRequested] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("join") === "code"
  );
  const [joinDismissed, setJoinDismissed] = useState(false);
  const [joinOpenedByClick, setJoinOpenedByClick] = useState(false);
  const joinOpen =
    (joinRequested || joinOpenedByClick) &&
    !joinDismissed &&
    loggedIn &&
    !isChecking;

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const userInfo = await api.post(`/isloggedin`, null);
        if (userInfo.data.code === "LOGGEDIN") {
          if (userInfo.data.role) {
            router.push(`/${userInfo.data.role}/dashboard`);
            return;
          }
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch {
        setLoggedIn(false);
      }
      setIsChecking(false);
    };
    getUserStatus();
  }, [router]);

  const requireLogin = (next: () => void, nextPath?: string) => {
    if (!loggedIn) {
      router.push(
        nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"
      );
      return;
    }
    next();
  };

  const handleJoinOpenChange = (next: boolean) => {
    if (!next) {
      setJoinDismissed(true);
      setJoinOpenedByClick(false);
    }
  };

  const handleJoinClick = () => {
    setJoinDismissed(false);
    setJoinOpenedByClick(true);
  };

  return (
    <>
      <GetStartedShell
        badge="Step 1 of 3 — Choose your path"
        title={
          <>
            Start your{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Reqora workspace
            </span>
          </>
        }
        subtitle="Set up a company as its admin, or join your team with a code. Sign-in is required for either path."
        step={1}
        maxWidth="max-w-5xl"
      >
        {isChecking ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {!loggedIn && (
              <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 text-center sm:flex-row sm:text-left">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <LogIn className="size-4 shrink-0 text-primary" />
                  You&apos;re signed out — sign in to create or join a workspace.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="shrink-0 cursor-pointer rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700"
                >
                  Go to login
                </button>
              </div>
            )}

            <div className="grid items-stretch gap-6 lg:grid-cols-2">
              <Reveal>
                <PathCard
                  icon={Building2}
                  badge="For workspace owners"
                  title="Create a company"
                  description="Set up departments, catalog resources, and invite your team. You become the admin."
                  points={[
                    "Admin workspace from scratch in minutes",
                    "Add departments, then catalog resources",
                    "Invite teammates via email or join code",
                  ]}
                  cta="Create workspace"
                  variant="primary"
                  recommended
                  onSelect={() =>
                    requireLogin(
                      () => router.push("/getstarted/createcompany"),
                      "/getstarted/createcompany"
                    )
                  }
                />
              </Reveal>
              <Reveal delay={0.08}>
                <PathCard
                  icon={KeyRound}
                  badge="Have a code or invite?"
                  title="Join your team"
                  description="Enter the join code from your admin — company, department, and role apply instantly."
                  points={[
                    "No setup — land in your team's workspace",
                    "Role assigned by your administrator",
                    "Request and track from day one",
                  ]}
                  cta="Join with a code"
                  variant="outline"
                  onSelect={() =>
                    requireLogin(handleJoinClick, "/getstarted?join=code")
                  }
                />
              </Reveal>
            </div>

            <div className="mt-8 grid gap-3 rounded-2xl border bg-card p-6 sm:grid-cols-3 sm:p-7">
              {helperFaqs.map((faq) => (
                <div key={faq.q} className="flex gap-2.5">
                  <CircleHelp className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{faq.q}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </GetStartedShell>

      <JoinCodeModal open={joinOpen} onOpenChange={handleJoinOpenChange} />
    </>
  );
};

export default Page;
