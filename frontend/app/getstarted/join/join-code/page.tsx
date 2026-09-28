"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Join codes are now entered in a modal on /getstarted.
// Keep this legacy route alive by forwarding deep links.
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/getstarted?join=code");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
};

export default Page;
