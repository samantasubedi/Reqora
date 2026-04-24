"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const page = () => {
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();
const formSubmitHandler=(data:)=>{
  console.log(data)
}
  return (
    <div className="flex justify-center  h-screen">
      <Card className="w-[50%] h-fit">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl">Add Resource</CardTitle>
          <CardDescription className="text-lg">Fill the resource details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={()=>{handleSubmit(formSubmitHandler)}}>
          <div>
            <label>Resource Name</label>
            <Input {...register("resourceName")} placeholder="Enter the resource name"></Input>
          </div>
          <div>
            <label>Quantity</label>
            <Input placeholder="Enter the resource Quantity"></Input>
          </div>
          <div>
            <label>Type</label>
            <Input placeholder="Select the resource Type"></Input>
          </div>
          <div>
            <label>Status</label>
            <Input placeholder="Select the resource status"></Input>
          </div>
          <div>
            <label>Department</label>
            <Input placeholder="Select the department"></Input>
          </div>
          <div>
            <label>Description</label>
            <Input placeholder="Write a description about the resource"></Input>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
