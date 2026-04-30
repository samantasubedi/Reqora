"use client";
import React, { useState } from "react";
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
import RoleAndExpiryTime from "./RoleAndExpiryTime";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutaionError } from "@/types/global";
import { CopyButton } from "../animate-ui/components/buttons/copy";
const schema = z.object({
  role: z.string().min(1, "please select a role"),
  expiryTime: z.coerce.number().min(1, "please select an expiry time"),
});
export type codeInviteFormType = z.infer<typeof schema>;

const InviteCodeGenerator = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "", expiryTime: 0 },
  });
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = form;
  const [joinCode, setJoinCode] = useState<string>("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: codeInviteFormType) => {
    const response = await axios.post(`${backendUrl}/invite/codeInvite`, data, {
      withCredentials: true,
    });
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success) {
        setJoinCode(data.joinCode);
        toast.success(data.message);
      }
    },
    onError: (error: T_MutaionError) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleFormSubmit = (data: codeInviteFormType) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center ">
      <Card className="md:w-[40%] w-[90%] mx-auto shadow-sm border border-teal-200 bg-slate-100  rounded-2xl mt-5">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <CardHeader>
            <CardTitle className="text-center text-2xl text-teal-800">
              Generate Invite code
            </CardTitle>
            <CardContent className="p-6">
              <RoleAndExpiryTime
                onChange={(values) => {
                  setValue("expiryTime", values.expiryTime);
                  if (values.expiryTime) {
                    form.clearErrors("expiryTime");
                  }
                  setValue("role", values.role);
                  if (values.role) {
                    form.clearErrors("role");
                  }
                }}
                values={{
                  expiryTime: Number(watch("expiryTime")),
                  role: watch("role"),
                }}
                errors={{
                  roleError: form.formState.errors.role?.message,
                  expiryTimeError: form.formState.errors.expiryTime?.message,
                }}
              />

              <div className="flex justify-center items-center gap-5">
                <Input
                  value={joinCode}
                  className="h-20 mt-5 text-3xl! bg-slate-200! text-center"
                  disabled
                  placeholder="Your code"
                ></Input>
                {joinCode && (
                  <CopyButton
                    className="size-12 text-3xl bg-gray-600 hover:bg-gray-700"
                    content={joinCode}
                  />
                )}
              </div>
            </CardContent>
          </CardHeader>
          <CardFooter className="flex flex-col">
            <div className="w-full flex justify-center">
              <Button
                type="submit"
                className="h-12 w-50! text-xl! cursor-pointer bg-cyan-800 hover:bg-cyan-700"
              >
                Generate Code
              </Button>
            </div>

            <div className="w-full bg-yellow-100 p-3 mt-5 rounded-lg">
              <span className="font-bold text-gray-800">Note :</span>

              <ol className="list-disc">
                <li className="text-gray-700">
                  This code can be used only <strong>once</strong> and will{" "}
                  <strong>expire</strong> after the specified time.
                </li>
                <li className="text-red-700">
                  Do not share this code with anyone except the intended
                  recipient.
                </li>
              </ol>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default InviteCodeGenerator;
