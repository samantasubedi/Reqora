import { cn } from "@/lib/utils";

// Decorative CSS barcode — no image asset needed.
const BARS = [3, 1, 2, 1, 4, 1, 1, 3, 2, 2, 1, 4, 1, 2, 3, 1, 2, 1];

export function Barcode({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex h-8 items-stretch gap-[2px]", className)}
    >
      {BARS.map((w, i) => (
        <span
          key={i}
          style={{ width: w }}
          className="bg-[var(--ink)] opacity-80"
        />
      ))}
    </div>
  );
}
