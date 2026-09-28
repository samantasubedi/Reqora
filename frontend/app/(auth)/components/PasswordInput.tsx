"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentProps<typeof Input>;

/**
 * Password field with a show/hide toggle. Forwards refs so it works
 * with react-hook-form's `register()` spread.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = React.useState(false);

    return (
      <span className="relative block">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          className={cn("pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    );
  }
);
