import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { statCardInterface } from "./AdminDashboard";
 const StatCard = ({
    title,
    number,
    IconName,
    subtext,
  }: statCardInterface) => {
    return (
      <Card
        className={`w-[23%] transition-all hover:translate-1 hover:border-slate-400 border border-transparent duration-300 ease-in-out cursor-pointer bg-linear-to-br from-slate-100 to bg-slate-50 `}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">

          <div className="space-y-1">
            <CardTitle className="text-xl font-medium leading-none">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {subtext}
            </CardDescription>
          </div>
          {IconName && (
            <div className="flex items-center justify-center rounded-lg p-3 ">
              <IconName className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{number}</div>
        </CardContent>
      </Card>
    );
  };
  export default StatCard