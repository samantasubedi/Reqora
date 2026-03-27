import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";
import {
  Popover,
  PopoverDescription,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverAnchor,
} from "../ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
const InviteForm = () => {
  return (
    <div className="flex gap-30">
      {/* <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-center">
            Invitation form
          </CardTitle>
          <CardDescription className="text-center">
            Enter the user email to send invite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label>Email</label>
          <Input placeholder="Enter the Email"></Input>
          <CardAction>
            <Button className="mt-2 bg-purple-800 hover:bg-purple-700 cursor-pointer">
              Invite
            </Button>
          </CardAction>
        </CardContent>
      </Card> */}

      <Popover>
        <PopoverTrigger>Invite</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle className="font-bold text-lg text-center">Invitation Form</PopoverTitle>
            <PopoverDescription className="text-center">
              Invite users through their Email
            </PopoverDescription>
          </PopoverHeader>
        <div className="mt-5"><label className="m-1 text-md">Email</label>
          <Input placeholder="Enter the Email"></Input>
        <Button className="mt-2 bg-purple-800 hover:bg-purple-700 cursor-pointer min-w-full">
              Invite
            </Button></div>  
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InviteForm;
