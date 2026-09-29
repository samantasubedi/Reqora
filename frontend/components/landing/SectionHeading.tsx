import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type KickerStyle = "rule" | "chip" | "ticket" | "plain";

type SectionHeadingProps = {
  kicker: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "right";
  style?: KickerStyle;
  className?: string;
};

// Each section gets its own kicker device instead of uniform 01–05 markers.
export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
  style = "rule",
  className,
}: SectionHeadingProps) {
  const right = align === "right";
  return (
    <Reveal className={cn("max-w-3xl", right && "ml-auto text-right", className)}>
      {style === "rule" && (
        <p
          className={cn(
            "flex items-center gap-3 text-[13px] font-bold tracking-wide text-[var(--stamp)]",
            right && "flex-row-reverse"
          )}
        >
          {kicker}
          <span aria-hidden className="h-px flex-1 bg-[var(--stamp)]/40" />
        </p>
      )}
      {style === "chip" && (
        <p>
          <span className="inline-flex -rotate-2 items-center rounded-md border-[1.5px] border-[var(--stamp)] px-2.5 py-1 text-[13px] font-bold tracking-wide text-[var(--stamp)]">
            {kicker}
          </span>
        </p>
      )}
      {style === "ticket" && (
        <p
          className={cn(
            "font-ledger inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--stamp)]/60 px-3 py-1 text-xs font-semibold text-[var(--stamp)]",
            right && "flex-row-reverse"
          )}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--stamp)]" />
          {kicker}
        </p>
      )}
      {style === "plain" && (
        <p className="text-[13px] font-bold tracking-wide text-muted-foreground">
          {kicker}
        </p>
      )}
      <h2 className="font-display mt-4 text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed font-medium text-muted-foreground">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
