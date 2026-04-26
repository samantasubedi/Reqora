import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center">
      <div className="flex gap-10 w-[30%] border-2 justify-evenly px-5">
        <div className="flex items-center gap-3">
          <Icon icon="ic:outline-email" className="text-2xl" />
          <span>Email Invite</span>
        </div>
        <div className="flex items-center gap-3">
          <Icon icon="pajamas:code" className="text-2xl" />
          <span>Invite Code</span>
        </div>
      </div>

      <Card>
        <CardContent>
          <label>Email Address </label>
          <Input placeholder="Enter email"></Input>
          <label>Role</label>
          <div>
            <button>Employee</button>
            <button>Manager</button>
            <button>Admin</button>
          </div>
          <label>Message</label>
          <Input placeholder="wirte a message (optional)"></Input>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
