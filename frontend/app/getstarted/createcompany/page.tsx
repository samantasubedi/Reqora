"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
type formData = {
  name: string;
  address: string;
  email: string;
};

const page = () => {
  const { register, setError, formState, handleSubmit } = useForm<formData>();
  const handleFormSubmit: SubmitHandler<formData> = (data: formData) => {
    console.log("this is form data", data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <label>Company Name</label>
        <Input placeholder="Enter your company name" {...register("name")} />
        <label>Address</label>
        <Input
          placeholder="Enter your company address"
          {...register("address")}
        />
        <label>Email</label>
        <Input placeholder="Enter your company email" {...register("email")} />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default page;
