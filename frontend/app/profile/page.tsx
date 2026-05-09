import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  const username = "samanta";
  const email = "samantasubedi01@gmail.com";
  const role = "admin";
  const companyName = "comapny1";
  return (
    <div className="flex justify-center p-5">
      <Card className="w-[60%] p-10">
        <CardContent className="flex justify-between" >
          <div className="flex gap-4">
         <div><Icon icon="material-symbols:person-rounded" className="text-7xl p-2 rounded-full bg-gray-200" /></div> 
          <div>
            <p className="font-bold text-2xl">{username}</p>
            <p className="text-gray-600">{email}</p>
            <p className="text-blue-600 px-2 rounded-2xl bg-blue-200 w-fit font-semibold">{role}</p>
          </div></div>
          <Button>Edit profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
