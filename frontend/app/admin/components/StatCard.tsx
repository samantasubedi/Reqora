import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statCardInterface } from "./AdminDashboard";
const borderGradientMap: Record<string, string> = {
  "border-blue-500": "via-blue-500",
  "border-green-500": "via-green-500",
  "border-amber-500": "via-amber-500",
  "border-red-500": "via-red-500",
  "blue-500": "via-blue-500",
  "green-500": "via-green-500",
  "amber-500": "via-amber-500",
  "red-500": "via-red-500",
};
const bgRadialMap: Record<string, string> = {
  "bg-blue-100": "from-blue-200/40 dark:from-blue-500/15",
  "bg-green-100": "from-green-200/40 dark:from-green-500/15",
  "bg-amber-100": "from-amber-200/40 dark:from-amber-500/15",
  "bg-red-100": "from-red-200/40 dark:from-red-500/15",
  "blue-100": "from-blue-200/40 dark:from-blue-500/15",
  "green-100": "from-green-200/40 dark:from-green-500/15",
  "amber-100": "from-amber-200/40 dark:from-amber-500/15",
  "red-100": "from-red-200/40 dark:from-red-500/15",
};

const StatCard = ({
  title,
  number,
  IconName,
  subtext,
  bgColor,
  textColor,
  borderColor,
}: statCardInterface) => {
  const viaColor = borderGradientMap[borderColor] || "via-blue-500";
  const centerGlow =
    bgRadialMap[bgColor] || "from-blue-200/40 dark:from-blue-500/15";

  return (
    <Card className="relative overflow-hidden border-none w-[23%] transition-all hover:translate-1 duration-300 ease-in-out cursor-pointer">
      <div
        className={`absolute inset-0 bg-radial ${centerGlow} via-transparent to-transparent pointer-events-none`}
      />

      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className={`text-xl leading-none font-bold ${textColor}`}>
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {subtext}
          </CardDescription>
        </div>
        {IconName && (
          <div className="flex items-center justify-center rounded-lg p-3">
            <IconName className="h-10 w-10 text-black dark:text-white" />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`text-4xl font-bold ${textColor}`}>{number}</div>
      </CardContent>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${viaColor} to-transparent z-10`}
      />
    </Card>
  );
};
export default StatCard;
