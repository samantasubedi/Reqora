export type DemoResource = {
  id: string;
  name: string;
  type: string;
  location: string;
  available: number;
  inUse: number;
  serialPrefix: string;
  suggestedReason: string;
};

// Same shelf as the review-queue screenshots so the demo and the
// product shots corroborate each other.
export const demoCatalog: DemoResource[] = [
  {
    id: "thinkpad",
    name: "ThinkPad X1 Carbon",
    type: "Laptop",
    location: "Floor 3 store",
    available: 18,
    inUse: 42,
    serialPrefix: "TPX1",
    suggestedReason: "Needed for onboarding a new backend engineer next week.",
  },
  {
    id: "epson",
    name: "Epson EB-X500",
    type: "Projector",
    location: "Training · Room B",
    available: 6,
    inUse: 11,
    serialPrefix: "EPX5",
    suggestedReason: "For the new-hire orientation session on Friday.",
  },
  {
    id: "laserjet",
    name: "HP LaserJet M428",
    type: "Printer",
    location: "Finance · Floor 2",
    available: 9,
    inUse: 14,
    serialPrefix: "HPLJ",
    suggestedReason: "Replacing two faulty units on the 3rd floor.",
  },
];

export const demoManager = { name: "Sita", role: "Manager" };

export const approveNoteFor = (location: string) =>
  `Approved — collect from ${location}.`;

export const rejectNoteDefault =
  "Needs a clearer business justification — please revise and resubmit.";

export const serialsFor = (
  prefix: string,
  quantity: number,
  seed = 1182
): string[] =>
  Array.from({ length: quantity }, (_, i) => `${prefix}-${seed + i}`);

export const randomDemoId = () =>
  `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

export const nowTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
