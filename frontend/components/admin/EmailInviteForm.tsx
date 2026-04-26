import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const EmailInviteForm = () => {
  const roleArray = [
    {
      role: "Employeee",
      description: "View and collaborate",
    },
    {
      role: "Manager",
      description: "Review the resource requests",
    },
    {
      role: "Admin",
      description: "Full workspace access",
    },
  ];
  return (
    <Card className="w-[40%] mx-auto shadow-lg border bg-blue-100 rounded-2xl mt-5">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium text-slate-700">
              Email Address
            </label>
            <Input
              placeholder="Enter email"
              className="focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-md font-medium text-slate-700">Role</label>
            <div className="flex gap-5">
              {roleArray.map((curr) => {
                return (
                  <button
                  key={curr.role}
                    className="h-20 flex flex-1 justify-center items-center  px-4 py-2 rounded-lg border border-slate-300 
              hover:bg-slate-100 hover:border-slate-400  bg-white
              transition-all duration-200"
                  >
                    <div>
                      <div className="font-semibold text-lg text-slate-600 font-sans">
                        {curr.role}
                      </div>
                      <div className="text-sm text-slate-500">
                        {curr.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-md font-medium text-slate-700">
              Message
            </label>
            <textarea
              rows={3}
              placeholder="Write a message (optional)"
              className="border border-slate-300 rounded-lg p-3 text-sm 
          focus:outline-none  bg-white"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all bg-blue-500 cursor-pointer hover:bg-blue-400">
          Send Invitation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailInviteForm;
