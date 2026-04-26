import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import z, { email } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const schema = z.object({
  email: z.email("Please enter an email").min(1, "Please enter an email"),
  role: z.string("Please select a role").min(1, "Please select a role"),
  description: z.string().optional(),
});
type formType = z.infer<typeof schema>;

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
  const {
    register,
    formState: { errors },
    setError,
    setValue,
    handleSubmit,
  } = useForm({ resolver: zodResolver(schema) });
  const handleFormSubmit = (data: formType) => {
    console.log(data);
  };
  return (
    <Card className="w-[40%] mx-auto shadow-lg border bg-blue-100 rounded-2xl mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-slate-700">
                Email Address
              </label>
              <Input
                {...register("email")}
                placeholder="Enter email"
                className="focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-slate-700">Role</label>
              <input type="hidden" {...register("role")}></input>
              <div className="flex gap-5">
                {roleArray.map((curr) => {
                  return (
                    <button
                      key={curr.role}
                      className="h-20 flex flex-1 justify-center items-center  px-4 py-2 rounded-lg border border-slate-300 
              hover:bg-slate-100 hover:border-slate-400  bg-white
              transition-all duration-200"
                      onClick={() => {
                        setValue("role", curr.role);
                      }}
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
              <p className="text-sm text-red-500">{errors.role?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-slate-700">
                Message
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Write a message (optional)"
                className="border border-slate-300 rounded-lg p-3 text-sm 
          focus:outline-none  bg-white"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            className="w-full rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all bg-blue-500 cursor-pointer hover:bg-blue-400"
          >
            Send Invitation
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailInviteForm;
