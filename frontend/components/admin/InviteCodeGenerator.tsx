import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Icon } from "@iconify/react";

const InviteCodeGenerator = () => {
  
  return (
    <div className="flex justify-center mt-[2%]">
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-teal-800">
            Generate Invite code
          </CardTitle>
          <CardContent>
<div>
 
</div>



            <div className="flex items-center gap-5 ">
              <Input
                className="h-20 mt-5 text-3xl! bg-slate-200! text-center"
                disabled
                placeholder="Your code"
              ></Input>
              <button className="flex items-center cursor-pointer">
                <Icon
                  icon="tabler:copy-filled"
                  className="size-20! text-gray-500"
                />
              </button>
            </div>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex flex-col">
          <div className="w-full flex justify-center">
            <Button className="h-12 w-50! text-xl! cursor-pointer bg-cyan-800 hover:bg-cyan-700">
              Generate Code
            </Button>
          </div>

          <div className="w-full bg-yellow-100 p-3 mt-5 rounded-lg">
            <span className="font-bold text-gray-800">Note :</span>

            <ol className="list-disc">
           
              <li className="text-gray-700">
               This code can be used only <strong>once</strong> and will <strong>expire</strong> after the specified time.
              </li>
              <li className="text-red-700">Do not share this code with anyone except the intended recipient.</li>
            </ol>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InviteCodeGenerator;
