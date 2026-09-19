export type ResourceItemStatus = "available" | "inUse" | "underMaintenance";

export type ResourceItem = {
  id: string;
  tag: string;
  serialNumber: string;
  status: ResourceItemStatus;
};

export type Resource = {
  id: string;
  name: string;
  type: string;
  department: string;
  location: string;
  items: ResourceItem[];
};

export type ResourceCounts = {
  total: number;
  available: number;
  inUse: number;
  underMaintenance: number;
};

export type AvailabilityLevel = "available" | "low" | "out";

export const getResourceCounts = (items: ResourceItem[]): ResourceCounts => ({
  total: items.length,
  available: items.filter((i) => i.status === "available").length,
  inUse: items.filter((i) => i.status === "inUse").length,
  underMaintenance: items.filter(
    (i) => i.status === "underMaintenance",
  ).length,
});

export const getAvailabilityLevel = (
  available: number,
  total: number,
): AvailabilityLevel => {
  if (available === 0) return "out";
  if (total > 0 && available / total <= 0.3) return "low";
  return "available";
};

type BuildItemsArgs = {
  prefix: string;
  available: number;
  inUse?: number;
  maintenance?: number;
};

const buildItems = ({
  prefix,
  available,
  inUse = 0,
  maintenance = 0,
}: BuildItemsArgs): ResourceItem[] => {
  const items: ResourceItem[] = [];
  let counter = 1;
  const push = (status: ResourceItemStatus, count: number) => {
    for (let i = 0; i < count; i++) {
      items.push({
        id: `${prefix}-${counter}`,
        tag: `${prefix}-${String(counter).padStart(3, "0")}`,
        serialNumber: `SN-${prefix}-${String(counter).padStart(4, "0")}`,
        status,
      });
      counter++;
    }
  };
  push("available", available);
  push("inUse", inUse);
  push("underMaintenance", maintenance);
  return items;
};

export const DUMMY_RESOURCES: Resource[] = [
  {
    id: "res-01",
    name: "ThinkPad X1 Carbon",
    type: "Laptop",
    department: "Engineering",
    location: "Block A · Floor 2",
    items: buildItems({ prefix: "LPT", available: 5, inUse: 2, maintenance: 1 }),
  },
  {
    id: "res-02",
    name: "Dell XPS 13",
    type: "Laptop",
    department: "Engineering",
    location: "Block B · Floor 1",
    items: buildItems({ prefix: "LPT", available: 6 }),
  },
  {
    id: "res-03",
    name: "Epson EB-X500",
    type: "Projector",
    department: "Engineering",
    location: "Training Room 3",
    items: buildItems({ prefix: "PJR", available: 4 }),
  },
  {
    id: "res-04",
    name: "Toyota Hilux",
    type: "Vehicle",
    department: "Engineering",
    location: "Parking Yard",
    items: buildItems({ prefix: "VCL", available: 2, inUse: 2, maintenance: 1 }),
  },
  {
    id: "res-05",
    name: "HP LaserJet M428",
    type: "Printer",
    department: "Engineering",
    location: "Block A · Floor 3",
    items: buildItems({ prefix: "PRN", available: 1, inUse: 2, maintenance: 1 }),
  },
  {
    id: "res-06",
    name: "Dell PowerEdge R640",
    type: "Server",
    department: "Engineering",
    location: "Data Center",
    items: buildItems({ prefix: "SRV", available: 3 }),
  },
];