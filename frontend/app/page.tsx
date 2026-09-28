"use client";

import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Navbar from "@/components/others/Navbar";
import Footer from "@/components/others/Footer";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { PainSolution } from "@/components/landing/PainSolution";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RoleTabs } from "@/components/landing/RoleTabs";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { OnboardingTeaser } from "@/components/landing/OnboardingTeaser";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await api.post(`/isloggedin`, null);

        if (response.data.code == "LOGGEDIN") {
          const { role } = response.data;
          setLoggedIn(true);

          if (role) {
            router.push(`/${role}/dashboard`);
            setRole(role);
            return;
          }
        } else if (response.data.code == "NOT_LOGGEDIN") {
          return;
        } else if (response.data.code == "TOKEN_REFRESHED") {
          router.push("/");
          return;
        }
      } catch {
        // Not logged in - stay on landing page.
      }
    };
    isLoggedIn();
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero loggedIn={loggedIn} role={role} />
        <StatsStrip />
        <PainSolution />
        <FeaturesBento />
        <HowItWorks />
        <RoleTabs />
        <ProductPreview />
        <OnboardingTeaser />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
