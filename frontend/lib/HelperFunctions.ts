export const calculatePages = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      2,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    2,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
export const camelToSentence = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};
export const groupItems = ({
  resourceItems,
  key,
}: {
  resourceItems: { location: string; status: string }[];
  key: "location" | "status";
}) => {
  const counts = new Map<string, number>();
  for (const item of resourceItems) {
    const value = item[key];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  if (key == "location") {
    return Array.from(counts, ([value, quantity]) => {
      return { location: value, quantity };
    });
  } else if (key == "status") {
    return Array.from(counts, ([value, quantity]) => {
      return { status: value, quantity };
    });
  }
};
