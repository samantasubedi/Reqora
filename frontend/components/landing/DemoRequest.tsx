"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Barcode } from "./Barcode";
import { Stamp } from "./Stamp";
import { LedgerCard, TicketDivider } from "./LedgerCard";
import { cn } from "@/lib/utils";
import {
  approveNoteFor,
  demoCatalog,
  demoManager,
  nowTime,
  randomDemoId,
  rejectNoteDefault,
  serialsFor,
  type DemoResource,
} from "./demoData";

type Stage = "compose" | "review" | "tracking" | "done";
type Outcome = "approved" | "rejected";

const priorityStyle: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  high: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

const railSteps = ["Request", "Review", "Track"] as const;

export function DemoRequest() {
  const router = useRouter();
  const ticketHeadingRef = useRef<HTMLParagraphElement>(null);

  const [stage, setStage] = useState<Stage>("compose");
  const [resource, setResource] = useState<DemoResource>(demoCatalog[0]);
  const [qty, setQty] = useState(1);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [reason, setReason] = useState(demoCatalog[0].suggestedReason);

  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("approved");
  const [note, setNote] = useState(approveNoteFor(demoCatalog[0].location));
  const [decidedAt, setDecidedAt] = useState("");
  const [serials, setSerials] = useState<string[]>([]);

  const pickResource = (r: DemoResource) => {
    setResource(r);
    setQty(1);
    setReason(r.suggestedReason);
    setNote(approveNoteFor(r.location));
    setOutcome("approved");
  };

  const pickOutcome = (o: Outcome) => {
    setOutcome(o);
    setNote(o === "approved" ? approveNoteFor(resource.location) : rejectNoteDefault);
  };

  const submit = () => {
    setTicketId(randomDemoId());
    setSubmittedAt(nowTime());
    setStage("review");
    requestAnimationFrame(() =>
      ticketHeadingRef.current?.focus({ preventScroll: true })
    );
  };

  const recordDecision = () => {
    const at = nowTime();
    setDecidedAt(at);
    if (outcome === "approved") {
      // Approval and allocation are one atomic step — the system assigns
      // the oldest available serials the instant the manager approves.
      setSerials(serialsFor(resource.serialPrefix, qty));
      setStage("tracking");
    } else {
      setStage("done");
    }
  };

  const reset = () => {
    const first = demoCatalog[0];
    setStage("compose");
    setResource(first);
    setQty(1);
    setPriority("medium");
    setReason(first.suggestedReason);
    setTicketId(null);
    setOutcome("approved");
    setNote(approveNoteFor(first.location));
    setSerials([]);
  };

  const approved = outcome === "approved";
  const assigned = (stage === "tracking" || stage === "done") && approved;
  const availableNow = resource.available - (assigned ? qty : 0);
  const inUseNow = resource.inUse + (assigned ? qty : 0);

  const railState = (i: number): "done" | "current" | "todo" | "skipped" => {
    if (stage === "compose") return i === 0 ? "current" : "todo";
    if (stage === "review") return i === 0 ? "done" : i === 1 ? "current" : "todo";
    if (stage === "tracking") return i < 2 ? "done" : "current";
    // done
    if (i < 2) return "done";
    return approved ? "done" : "skipped";
  };

  const statusStamp =
    stage === "review" ? (
      <Stamp tone="pending">Pending</Stamp>
    ) : assigned ? (
      <Stamp tone="success">Allocated</Stamp>
    ) : stage === "done" ? (
      <Stamp tone="danger">Rejected</Stamp>
    ) : null;

  return (
    <LedgerCard className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ledger-line)] px-5 py-3 sm:px-7">
        <p className="text-[13px] font-bold text-foreground">
          Try it — play requester, reviewer, tracker
          <span className="ml-2 font-medium text-muted-foreground">
            Simulated data, runs entirely in your browser
          </span>
        </p>
        <div className="flex items-center gap-3">
          {stage !== "compose" && (
            <button
              type="button"
              onClick={reset}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--ledger-line)] px-3 py-1 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              Replay
            </button>
          )}
          <Barcode className="hidden h-5 opacity-60 sm:block" />
        </div>
      </div>

      {/* stage rail */}
      <ol className="flex items-center gap-2 border-b border-[var(--ledger-line)] bg-[var(--paper)] px-5 py-3 sm:px-7">
        {railSteps.map((label, i) => {
          const state = railState(i);
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  state === "done" &&
                    "border-[var(--stamp)] bg-[var(--stamp)] text-white",
                  state === "current" &&
                    "border-[var(--stamp)] text-[var(--stamp)]",
                  state === "todo" &&
                    "border-[var(--ledger-line)] text-muted-foreground",
                  state === "skipped" &&
                    "border-dashed border-[var(--ledger-line)] text-muted-foreground/60"
                )}
              >
                {state === "done" ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[13px] font-bold",
                  state === "current" || state === "done"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
                {state === "skipped" && (
                  <span className="ml-1 font-medium">(skipped)</span>
                )}
              </span>
              {i < railSteps.length - 1 && (
                <span
                  aria-hidden
                  className="mx-1 h-px flex-1 bg-[var(--ledger-line)]"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid lg:grid-cols-2">
        {/* left: role-play controls */}
        <div className="border-b border-[var(--ledger-line)] p-5 sm:p-7 lg:border-r lg:border-b-0">
          {stage === "compose" && (
            <div>
              <p className="text-[13px] font-bold text-[var(--stamp)]">
                Step 1 · You are the employee
              </p>
              <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Choose a resource">
                {demoCatalog.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={resource.id === r.id}
                    onClick={() => pickResource(r)}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 text-left transition-colors",
                      resource.id === r.id
                        ? "border-[var(--stamp)] bg-[var(--stamp)]/5"
                        : "border-[var(--ledger-line)] hover:border-[var(--stamp)]/50"
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">{r.name}</span>
                      <span className="font-ledger text-xs font-semibold text-[var(--stamp)]">
                        {r.available} avail
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
                      {r.type} · {r.location}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">Qty</span>
                  <div className="flex items-center rounded-full border border-[var(--ledger-line)]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="cursor-pointer p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => Math.min(resource.available, q + 1))}
                      className="cursor-pointer p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[var(--ledger-line)] p-1" role="radiogroup" aria-label="Priority">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={priority === p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors",
                        priority === p
                          ? priorityStyle[p]
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-bold text-muted-foreground">
                  Reason (goes on the record)
                </span>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="mt-1.5 bg-[var(--paper)]"
                />
              </label>

              <Button
                onClick={submit}
                disabled={reason.trim() === ""}
                className="mt-4 w-full cursor-pointer bg-[var(--stamp)] font-semibold text-white hover:brightness-110 sm:w-auto"
              >
                <Send className="size-4" />
                Submit request
              </Button>
            </div>
          )}

          {stage === "review" && (
            <div>
              <p className="text-[13px] font-bold text-[var(--stamp)]">
                Step 2 · You are {demoManager.name}, the manager
              </p>
              <p className="mt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                {resource.name} × {qty} is waiting in your queue. Approve and
                the system assigns serials instantly — your call and your note
                go on the record either way.
              </p>
              <div className="mt-4 flex gap-1 rounded-xl border border-[var(--ledger-line)] p-1" role="radiogroup" aria-label="Decision">
                <button
                  type="button"
                  role="radio"
                  aria-checked={outcome === "approved"}
                  onClick={() => pickOutcome("approved")}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                    outcome === "approved"
                      ? "bg-[var(--stamp)] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Check className="size-4" />
                  Approve
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={outcome === "rejected"}
                  onClick={() => pickOutcome("rejected")}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                    outcome === "rejected"
                      ? "bg-[var(--status-danger-text)] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <X className="size-4" />
                  Reject
                </button>
              </div>
              <label className="mt-4 block">
                <span className="text-xs font-bold text-muted-foreground">
                  Decision note (recorded with your name + timestamp)
                </span>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="mt-1.5 bg-[var(--paper)]"
                />
              </label>
              <Button
                onClick={recordDecision}
                disabled={note.trim() === ""}
                className="mt-4 w-full cursor-pointer bg-[var(--ink)] font-semibold text-[var(--paper)] hover:brightness-125 sm:w-auto"
              >
                Record {outcome === "approved" ? "approval" : "rejection"}
              </Button>
            </div>
          )}

          {stage === "tracking" && (
            <div>
              <p className="text-[13px] font-bold text-[var(--stamp)]">
                Step 3 · Back to you — track it
              </p>
              <p className="mt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                Approved and assigned in the same instant — no second queue, no
                waiting on anyone. Here&apos;s your pickup slip:
              </p>
              <div className="mt-4 rounded-lg border border-[var(--ledger-line)] bg-[var(--paper)] p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <MapPin className="size-4 text-[var(--stamp)]" />
                  Collect from {resource.location}
                </p>
                <p className="font-ledger mt-2 text-sm font-bold text-foreground">
                  {serials.join(" · ")}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Oldest available units, assigned automatically at approval ·
                  status flipped to in use
                </p>
              </div>
              <Button
                onClick={() => setStage("done")}
                className="mt-4 w-full cursor-pointer bg-[var(--ink)] font-semibold text-[var(--paper)] hover:brightness-125 sm:w-auto"
              >
                Got it — finish
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}

          {stage === "done" && (
            <div>
              <p className="text-[13px] font-bold text-[var(--stamp)]">
                {approved ? "Filed · end of the trail" : "Filed · even rejections leave a trail"}
              </p>
              <p className="font-display mt-2 text-2xl leading-tight font-semibold text-foreground">
                {approved
                  ? "That took 30 seconds. Imagine it with real teammates."
                  : "No ghosting — the requester sees why, and what to fix."}
              </p>
              <p className="mt-2 text-sm leading-relaxed font-medium text-muted-foreground">
                {approved
                  ? `${qty} × ${resource.name} (${serials.join(", ")}) moved from available to in use the second ${demoManager.name} approved — reviewer, note, and timestamps all on the record.`
                  : `The requester sees who rejected, when, and your note — instead of silence. They can revise and resubmit in one click.`}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={() => router.push("/getstarted")}
                  className="cursor-pointer bg-[var(--stamp)] font-semibold text-white hover:brightness-110"
                >
                  Get started free
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="cursor-pointer border-[var(--ledger-line)] bg-[var(--paper-card)] font-semibold"
                >
                  <RotateCcw className="size-4" />
                  Replay the demo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* right: live ticket */}
        <div className="bg-[var(--paper)] p-5 sm:p-7">
          {ticketId === null ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--ledger-line)] p-8 text-center">
              <Send className="size-6 text-muted-foreground" />
              <p className="text-sm font-bold text-foreground">
                Your ticket prints here
              </p>
              <p className="max-w-xs text-sm leading-relaxed font-medium text-muted-foreground">
                Fill in the request on the left and submit — then review it
                and track it yourself, playing each role in turn.
              </p>
            </div>
          ) : (
            <div aria-live="polite" className="min-h-[380px]">
              <div className="flex items-start justify-between gap-3">
                <p
                  ref={ticketHeadingRef}
                  tabIndex={-1}
                  className="font-ledger text-sm font-bold text-foreground outline-none"
                >
                  {ticketId}
                </p>
                {statusStamp}
              </div>

              <p className="font-display mt-2 text-xl leading-snug font-semibold text-foreground">
                {resource.name} × {qty}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-muted-foreground">
                {resource.type} · {resource.location} ·{" "}
                <span className={cn("rounded px-1.5 py-0.5 capitalize", priorityStyle[priority])}>
                  {priority} priority
                </span>
              </p>
              <p className="mt-2 border-l-2 border-[var(--stamp)] pl-3 text-sm leading-relaxed text-muted-foreground italic">
                “{reason}”
              </p>

              <TicketDivider className="my-4 px-0" />

              <ul className="space-y-0">
                <li className="flex items-baseline gap-3 border-b border-dashed border-[var(--ledger-line)] py-2.5">
                  <span className="font-ledger w-20 shrink-0 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {submittedAt}
                  </span>
                  <p className="text-sm font-medium text-foreground/90">
                    <span className="font-bold">You</span>{" "}
                    <span className="text-muted-foreground">
                      submitted {qty} × {resource.name} · {priority} priority
                    </span>
                  </p>
                </li>
                {(stage === "tracking" || stage === "done") && (
                  <li className="flex items-baseline gap-3 border-b border-dashed border-[var(--ledger-line)] py-2.5">
                    <span className="font-ledger w-20 shrink-0 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {decidedAt}
                    </span>
                    <p className="text-sm font-medium text-foreground/90">
                      <span className="font-bold">
                        {demoManager.name} ({demoManager.role})
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {approved ? "approved" : "rejected"} — “{note}”
                      </span>
                    </p>
                  </li>
                )}
                {assigned && (
                  <li className="flex items-baseline gap-3 py-2.5">
                    <span className="font-ledger w-20 shrink-0 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {decidedAt}
                    </span>
                    <p className="text-sm font-medium text-foreground/90">
                      <span className="font-bold">System</span>{" "}
                      <span className="text-muted-foreground">
                        assigned oldest available{" "}
                        <span className="font-ledger font-bold text-foreground">
                          {serials.join(" · ")}
                        </span>{" "}
                        → in use
                      </span>
                    </p>
                  </li>
                )}
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[var(--ledger-line)] bg-[var(--paper-card)] px-3 py-2">
                  <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                    Available
                  </p>
                  <p className="text-xl font-bold text-foreground">{availableNow}</p>
                </div>
                <div className="rounded-lg border border-[var(--ledger-line)] bg-[var(--paper-card)] px-3 py-2">
                  <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                    In use
                  </p>
                  <p className="text-xl font-bold text-foreground">{inUseNow}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LedgerCard>
  );
}
