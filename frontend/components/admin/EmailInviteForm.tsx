import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import z, { email } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutaionError } from "@/types/global";
import RoleAndExpiryTime from "./RoleAndExpiryTime";
import RoleSelector from "./RoleSelector";
const schema = z.object({
  email: z.email("Please enter an email").min(1, "Please enter an email"),
  role: z.string("Please select a role").min(1, "Please select a role"),
  description: z.string().optional(),
  expiryTime: z.coerce
    .number()
    .min(1, "please provide an invitation expiry time"),
});
export type emailInviteFormType = z.infer<typeof schema>;

const EmailInviteForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      expiryTime: 0,
    },
  });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
  } = form;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: emailInviteFormType) => {
    const response = await axios.post(
      `${backendUrl}/invite/emailInvite`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      }
    },
    onError: (Error: T_MutaionError) => {
      if (Error.response) {
        toast.error(Error.response?.data.message);
      } else {
        toast.error(Error.message);
      }
    },
  });

  const handleFormSubmit: SubmitHandler<emailInviteFormType> = (
    data: emailInviteFormType,
  ) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <Card className="w-[40%] mx-auto shadow-sm border border-teal-200 bg-slate-100  rounded-2xl mt-5">
  <CardHeader>
    <CardTitle className="text-center text-2xl text-teal-800 font-bold">Send an invitation Email</CardTitle>
  </CardHeader>
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
              <RoleAndExpiryTime
                errors={{
                  roleError: errors.role?.message,
                  expiryTimeError: errors.expiryTime?.message,
                }}
                values={{
                  expiryTime: Number(watch("expiryTime")),
                  role: watch("role"),
                }}
                onChange={(values) => {
                  setValue("role", values.role);
                  if (values.role) form.clearErrors("role");
                  setValue("expiryTime", values.expiryTime);
                  if (values.expiryTime) form.clearErrors("expiryTime");
                }}
              />

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
