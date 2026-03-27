"use client";
import {
  Popover,
  PopoverDescription,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Icon } from "@iconify/react";

const InviteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ email: string }>();
  const handleInvite: SubmitHandler<{ email: string }> = async (emailObj) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL!;
    try {
      const response = await axios.post(`${backendUrl}/invite`, emailObj, {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Popover>
      <PopoverTrigger className="flex gap-3 ml-1">
        <Icon icon="mdi:invite" />
       <span className="text-sm">Invite Employees</span> 
      </PopoverTrigger>
      <PopoverContent className="w-100">
        <PopoverHeader>
          <PopoverTitle className="font-bold text-lg text-center">
            Invitation Form
          </PopoverTitle>
          <PopoverDescription className="text-center">
            Invite users through their Email
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-5">
          <form onSubmit={handleSubmit(handleInvite)}>
            <label className="m-1 text-md">Email</label>
            <Input
              {...register("email", {
                required: "Please enter the email!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid Email!",
                },
              })}
              placeholder="Enter the Email"
            ></Input>
            <p className="text-red-500 text-sm p-1">{errors.email?.message}</p>
            <Button
              className="mt-2 bg-purple-800 hover:bg-purple-700 cursor-pointer min-w-full"
              type="submit"
            >
              Invite
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InviteForm;
