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
import { Button } from "@/components/ui/button";
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
    <div className="flex justify-center items-start min-h-screen bg-slate-50 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 rounded-2xl overflow-hidden bg-blue-100">
        <div className="h-1.5 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500" />
        <CardHeader className="text-center px-10 pt-10 pb-6">
          <CardTitle className="text-4xl font-bold tracking-tight text-slate-800">
            Add Resource
          </CardTitle>
          <CardDescription className="text-base text-slate-500 mt-1">
            Fill the resource details below
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                Resource Name
              </label>
              <Input
                {...register("resourceName")}
                placeholder="Enter the resource name"
                className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <p className="text-xs text-red-500 font-medium">
                {errors.resourceName?.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Quantity
                </label>
                <Input
                  {...register("quantity")}
                  placeholder="e.g. 10"
                  type="select a type"
                  className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
                <p className="text-xs text-red-500 font-medium">
                  {errors.quantity?.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Type
                </label>
                <Input
                  {...register("type")}
                  placeholder="e.g. Hardware"
                  className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
                <p className="text-xs text-red-500 font-medium">
                  {errors.type?.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Status
                </label>
                <Input
                  {...register("status")}
                  placeholder="select a status"
                  className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
                <p className="text-xs text-red-500 font-medium">
                  {errors.status?.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Department
                </label>
                <Input
                  {...register("department")}
                  placeholder="e.g. Engineering"
                  className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
                <p className="text-xs text-red-500 font-medium">
                  {errors.department?.message}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                Description
              </label>
              <Input
                {...register("description")}
                placeholder="Write a description about the resource (optional)"
                className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <p className="text-xs text-red-500 font-medium">
                {errors.description?.message}
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
              >
                Submit Resource
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
