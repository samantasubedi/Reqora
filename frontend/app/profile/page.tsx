import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  const username = "samanta";
  const email = "samantasubedi01@gmail.com";
  const role = "admin";
  const companyName = "comapny1";
  return (
    <div>
      <Card>
        <CardContent>
          <Icon icon="material-symbols:person-rounded" width="24" height="24" />
          <div>
            <p>{username}</p>
            <p>{email}</p>
            <p>{role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
