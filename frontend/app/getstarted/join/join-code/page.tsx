import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center">
      <Card className="md:w-[30%] md:mt-[10%]">
        <CardHeader>
          <CardTitle>  <Icon icon="mdi:people" width="24" height="24" />Join a Company</CardTitle>
          <CardDescription>
            Enter the company code shared by your administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label> Join Code</label>
          <Input placeholder="eg: H3E0klMT3f"></Input>
        </CardContent>
        <CardFooter>
          <Button>Join</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
