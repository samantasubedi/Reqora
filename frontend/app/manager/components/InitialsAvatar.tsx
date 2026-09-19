import { cn } from "@/lib/utils";

const avatarColors = [
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
  "from-rose-500 to-rose-700",
  "from-amber-500 to-amber-700",
  "from-emerald-500 to-emerald-700",
  "from-sky-500 to-sky-700",
];

const InitialsAvatar = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr text-primary-foreground",
        avatarColors[colorIndex],
        className,
      )}
    >
      <span className="text-xs font-bold tracking-wide">{initials || "U"}</span>
    </span>
  );
};

export default InitialsAvatar;