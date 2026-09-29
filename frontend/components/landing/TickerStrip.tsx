// Kept marquee, de-shouted: mixed-case sans with mono IDs sprinkled in.
const entries = [
  { text: "112 total resources in the ledger", mono: false },
  { text: "67 available right now", mono: false },
  { text: "cmuaqLp8 → approved", mono: true },
  { text: "40 in use, each tied to a request", mono: false },
  { text: "cmuaqLq4 → rejected with a note", mono: true },
  { text: "5 under maintenance, none missing", mono: false },
  { text: "Every decision carries reviewer + timestamp", mono: false },
  { text: "cmun17jk → awaiting review", mono: true },
];

export function TickerStrip() {
  const row = [...entries, ...entries];
  return (
    <section
      aria-label="Resource ledger summary"
      className="overflow-hidden border-b border-[var(--ledger-line)] bg-[var(--ink)] py-3 text-[var(--paper)]"
    >
      <div className="animate-ledger-marquee flex w-max items-center gap-8 pr-8">
        {row.map((entry, i) => (
          <p
            key={`${entry.text}-${i}`}
            className={
              entry.mono
                ? "font-ledger flex items-center gap-8 text-xs font-semibold tracking-wider whitespace-nowrap uppercase"
                : "flex items-center gap-8 text-[13px] font-semibold whitespace-nowrap"
            }
          >
            {entry.text}
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-current opacity-60" />
          </p>
        ))}
      </div>
    </section>
  );
}
