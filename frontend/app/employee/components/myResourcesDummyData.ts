export type MyResourceStatus = "inUse";

export type MyResource = {
  id: string;
  name: string;
  type: string;
  department: string;
  location: string;
  assignedAt: string;
  status: MyResourceStatus;
  note?: string;
};

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const DUMMY_MY_RESOURCES: MyResource[] = [
  {
    id: "itm-001",
    name: "MacBook Pro 16",
    type: "Laptop",
    department: "Engineering",
    location: "Office - Floor 3",
    assignedAt: daysAgo(120),
    status: "inUse",
    note: "Primary dev machine",
  },
  {
    id: "itm-002",
    name: "Dell UltraSharp 32",
    type: "Monitor",
    department: "Engineering",
    location: "Office - Floor 3",
    assignedAt: daysAgo(64),
    status: "inUse",
  },
  {
    id: "itm-003",
    name: "Jabra Evolve2 85",
    type: "Headset",
    department: "Engineering",
    location: "Office - Floor 3",
    assignedAt: daysAgo(32),
    status: "inUse",
  },
  {
    id: "itm-004",
    name: "Keychron K2 Mechanical Keyboard",
    type: "Hardware",
    department: "Engineering",
    location: "Office - Floor 3",
    assignedAt: daysAgo(28),
    status: "inUse",
  },
  {
    id: "itm-005",
    name: "ThinkPad X1 Carbon",
    type: "Laptop",
    department: "Design",
    location: "Design Studio",
    assignedAt: daysAgo(200),
    status: "inUse",
    note: "For on-site client workshops",
  },
  {
    id: "itm-006",
    name: "Wacom Cintiq 22",
    type: "Hardware",
    department: "Design",
    location: "Design Studio",
    assignedAt: daysAgo(85),
    status: "inUse",
  },
  {
    id: "itm-007",
    name: "Sony WH-1000XM5",
    type: "Headset",
    department: "Design",
    location: "Design Studio",
    assignedAt: daysAgo(41),
    status: "inUse",
  },
  {
    id: "itm-008",
    name: "Herman Miller Aeron Chair",
    type: "Furniture",
    department: "Operations",
    location: "Home Office",
    assignedAt: daysAgo(150),
    status: "inUse",
  },
  {
    id: "itm-009",
    name: "Logitech MX Master 3S",
    type: "Hardware",
    department: "Operations",
    location: "Home Office",
    assignedAt: daysAgo(22),
    status: "inUse",
  },
];