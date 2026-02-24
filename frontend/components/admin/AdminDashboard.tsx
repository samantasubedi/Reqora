import React from "react";
import test from "../Test";
import { Check, CircleAlert, LucideIcon, Plus, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Book, Package } from "lucide-react";
import { Button } from "../ui/button";
export interface statCardInterface {
  title: string;
  number: number;

  IconName?: LucideIcon;
  subtext?: string;
}
const AdminDashboard = () => {
  const AdminStat: statCardInterface[] = [
    {
      title: "Total Resources",
      number: 50,
      IconName: Package,
    },
    {
      title: "Available",
      number: 39,
      IconName: Check,
      subtext: "70% of total",
    },
    {
      title: "In Use",
      number: 20,
      IconName: TrendingUp,
      subtext: "40% of total",
    },
    {
      title: "Under Maintenance",
      number: 5,
      IconName: CircleAlert,
      subtext: "10% of total",
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold text-slate-600 m-2">
          Admin Dashboard
        </h1>
        <div className="flex justify-between px-3">
          {" "}
          <p className="text-gray-500 m-2">
            Monitor and manage all organization resource
          </p>
          <Button className="text-white bg-purple-800 font-bold hover:bg-purple-700 cursor-pointer">
            {" "}
            <Plus className="font-bold"></Plus> Add Resource
          </Button>
        </div>
        <div className="flex justify-between m-3">
          {AdminStat.map((curr) => {
            return (
              <StatCard
                key={curr.title}
                title={curr.title}
                number={curr.number}
                IconName={curr.IconName}
                subtext={curr.subtext}
              ></StatCard>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;
