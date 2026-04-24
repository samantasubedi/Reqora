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
import z from "zod";
const schema = z.object({
  resourceName: z
    .string({ message: "please enter the resource name" })
    .trim()
    .min(1, "please enter the resource name")
    .min(3, "Name must be at least 3 characters"),
  quantity: z.coerce
    .number({ message: "please enter the quantity!" })
    .min(1, "please enter a valid quantity"),
  type: z
    .string({ message: "please select a type" })
    .min(1, "please select a type"),
  status: z
    .string({ message: "please select a status" })
    .min(1, "please select a status"),
  department: z
    .string({ message: "please enter the department" })
    .min(1, "please enter a department"),
  description: z.string().trim().optional(),
});
type formDataType = z.infer<typeof schema>;
const page = () => {
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: zodResolver(schema) });
  const formSubmitHandler = (data: formDataType) => {
    console.log(data);
  };
  return (
    <div className="flex justify-center  h-screen">
      <Card className="w-[50%] h-fit">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl">Add Resource</CardTitle>
          <CardDescription className="text-lg">
            Fill the resource details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={() => {
              handleSubmit(formSubmitHandler);
            }}
          >
            <div>
              <label>Resource Name</label>
              <Input
                {...register("resourceName")}
                placeholder="Enter the resource name"
              ></Input>
              <p>{errors.resourceName?.message}</p>
            </div>
            <div>
              <label>Quantity</label>
              <Input 
               {...register("quantity")}
              placeholder="Enter the resource Quantity"></Input>
            </div>
            <div>
              <label>Type</label>
              <Input
               {...register("type")}
              placeholder="Select the resource Type"></Input>
            </div>
            <div>
              <label>Status</label>
              <Input
               {...register("status")}
              placeholder="Select the resource status"></Input>
            </div>
            <div>
              <label>Department</label>
              <Input
               {...register("department")}
              placeholder="Select the department"></Input>
            </div>
            <div>
              <label>Description</label>
              <Input 
               {...register("description")}
              placeholder="Write a description about the resource"></Input>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
