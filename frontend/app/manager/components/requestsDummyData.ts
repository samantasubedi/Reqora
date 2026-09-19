export type RequestStatus = "pending" | "approved" | "rejected";

export type ResourceRequest = {
  id: string;
  employee: { name: string; email: string; department: string };
  resource: { name: string; type: string };
  requestedQuantity: number;
  note?: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt?: string;
};

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const DUMMY_REQUESTS: ResourceRequest[] = [
  {
    id: "req-01",
    employee: { name: "Ram Sharma", email: "ram.sharma@reqora.io", department: "Engineering" },
    resource: { name: "ThinkPad X1 Carbon", type: "Laptop" },
    requestedQuantity: 1,
    note: "Needed for onboarding a new backend engineer next week.",
    status: "pending",
    createdAt: daysAgo(5),
  },
  {
    id: "req-02",
    employee: { name: "Sita Thapa", email: "sita.thapa@reqora.io", department: "Training" },
    resource: { name: "Epson EB-X500", type: "Projector" },
    requestedQuantity: 1,
    note: "For the new-hire orientation session on Friday.",
    status: "pending",
    createdAt: daysAgo(3),
  },
  {
    id: "req-03",
    employee: { name: "Hari KC", email: "hari.kc@reqora.io", department: "Operations" },
    resource: { name: "Toyota Hilux", type: "Vehicle" },
    requestedQuantity: 1,
    note: "Campus-to-client weekly delivery route.",
    status: "pending",
    createdAt: daysAgo(2),
  },
  {
    id: "req-04",
    employee: { name: "Anjali Gurung", email: "anjali.gurung@reqora.io", department: "Finance" },
    resource: { name: "HP LaserJet M428", type: "Printer" },
    requestedQuantity: 2,
    note: "Replacing two faulty units on the 3rd floor.",
    status: "pending",
    createdAt: daysAgo(1),
  },
  {
    id: "req-05",
    employee: { name: "Bibek Shrestha", email: "bibek.shrestha@reqora.io", department: "IT" },
    resource: { name: "Dell PowerEdge R640", type: "Server" },
    requestedQuantity: 1,
    note: "Staging environment for the load-balancer rollout.",
    status: "pending",
    createdAt: daysAgo(0.2),
  },
  {
    id: "req-06",
    employee: { name: "Priya Rai", email: "priya.rai@reqora.io", department: "Engineering" },
    resource: { name: "MacBook Pro 14\"", type: "Laptop" },
    requestedQuantity: 1,
    status: "approved",
    createdAt: daysAgo(10),
    reviewedAt: daysAgo(8),
  },
  {
    id: "req-07",
    employee: { name: "Sunil Tamang", email: "sunil.tamang@reqora.io", department: "Admin" },
    resource: { name: "Standing Desk", type: "Furniture" },
    requestedQuantity: 2,
    status: "approved",
    createdAt: daysAgo(12),
    reviewedAt: daysAgo(9),
  },
  {
    id: "req-08",
    employee: { name: "Meera Joshi", email: "meera.joshi@reqora.io", department: "Marketing" },
    resource: { name: "Canon PIXMA Pro", type: "Printer" },
    requestedQuantity: 1,
    status: "approved",
    createdAt: daysAgo(8),
    reviewedAt: daysAgo(7),
  },
  {
    id: "req-09",
    employee: { name: "Bikash Karki", email: "bikash.karki@reqora.io", department: "Engineering" },
    resource: { name: "Dell XPS 13", type: "Laptop" },
    requestedQuantity: 1,
    status: "approved",
    createdAt: daysAgo(6),
    reviewedAt: daysAgo(5),
  },
  {
    id: "req-10",
    employee: { name: "Ramesh Adhikari", email: "ramesh.adhikari@reqora.io", department: "Training" },
    resource: { name: "BenQ MH733", type: "Projector" },
    requestedQuantity: 1,
    status: "approved",
    createdAt: daysAgo(9),
    reviewedAt: daysAgo(4),
  },
  {
    id: "req-11",
    employee: { name: "Kabita Shrestha", email: "kabita.shrestha@reqora.io", department: "IT" },
    resource: { name: "HP ProLiant DL380", type: "Server" },
    requestedQuantity: 1,
    note: "Duplicate of an earlier approved request.",
    status: "rejected",
    createdAt: daysAgo(11),
    reviewedAt: daysAgo(9),
  },
  {
    id: "req-12",
    employee: { name: "Deepak Lama", email: "deepak.lama@reqora.io", department: "Operations" },
    resource: { name: "Ergonomic Chair", type: "Furniture" },
    requestedQuantity: 4,
    note: "Stock not available; will requote next quarter.",
    status: "rejected",
    createdAt: daysAgo(7),
    reviewedAt: daysAgo(6),
  },
];

export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const timeAgo = (iso: string) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(iso);
};