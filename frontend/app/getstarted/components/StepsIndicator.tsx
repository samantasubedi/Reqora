"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Choose path", "Set up", "Invite team"];

export function StepsIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < current;
        const isActive = stepNumber === current;
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "h-0.5 w-6 rounded-full sm:w-10",
                  stepNumber <= current ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  isDone || isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <Check className="size-3.5" /> : stepNumber}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
