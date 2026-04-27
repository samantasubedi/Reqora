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
    watch
  } = useForm({ resolver: zodResolver(schema) });
  const handleFormSubmit = (data: formType) => {
    console.log(data);
  };
  const selectedRole=watch("role")
  return (
    <Card className="w-[40%] mx-auto shadow-sm border border-teal-200 bg-slate-100  rounded-2xl mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-teal-800">
                Email Address
              </label>
              <Input
                {...register("email")}
                placeholder="Enter email"
                className="focus:ring-2 focus:ring-teal-400 border-teal-200 bg-white placeholder:text-slate-400"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-teal-800">Role</label>
              <input type="hidden" {...register("role")} />
              <div className="flex gap-5">
                {roleArray.map((curr) => {
                  return (
                    <button
                      type="button"
                      key={curr.role}
                      className={`h-20 flex flex-1 justify-center items-center px-4 py-2 rounded-xl border
                        transition-all duration-200
                        ${
                          selectedRole === curr.role
                            ? "bg-teal-800/80 border-teal-500 shadow-md shadow-teal-200"
                            : "bg-white border-teal-100 hover:bg-teal-50 hover:border-teal-300"
                        }`}
                      onClick={() => setValue("role", curr.role)}
                    >
                      <div>
                        <div className={`font-semibold text-lg font-sans ${selectedRole === curr.role ? "text-white" : "text-teal-700"}`}>
                          {curr.role}
                        </div>
                        <div className={`text-sm ${selectedRole === curr.role ? "text-teal-100" : "text-slate-400"}`}>
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
              <label className="text-md font-medium text-teal-800">
                Message
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Write a message (optional)"
                className="border border-teal-200 rounded-xl p-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            className="w-full rounded-xl text-sm font-semibold  hover:shadow-lg  bg-teal-700 hover:bg-teal-600 cursor-pointer text-white"
          >
            Send Invitation
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailInviteForm;
