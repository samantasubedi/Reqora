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
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutaionError } from "@/types/global";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import SelectBox from "@/components/others/SelectBox";

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
  location: z
    .string({ message: "please enter a location" })
    .min(1, "Please enter a location")
    .min(3, "please enter a valid location"),
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
    reset,
    setValue,
    getValues,
  } = useForm({ resolver: zodResolver(schema) });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: formDataType) => {
    const response = await axios.post(`${backendUrl}/resources`, data, {
      withCredentials: true,
    });
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
    },
    onError: (error: T_MutaionError) => {
      if (error.response) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const formSubmitHandler = (data: formDataType) => {
    mutation.mutate(data);
    console.log(data);
  };

  const statusOptions = [
    { label: "Available", value: "available" },
    { label: "In use", value: "inUse" },
    { label: "Under Maintainence", value: "underMaintainence" },
  ];
  const typeOptions = [
    { label: "Hardware", value: "Hardware" },
    { label: "Software", value: "Software" },
    { label: "Digital Asset", value: "Digital Asset" },
    { label: "Human Resource", value: "Human Resource" },
    { label: "Facility", value: "Faciltiy" },
    { label: "Service", value: "Service" },
    { label: "Consumable", value: "Consumable" },
    { label: "Data", value: "Data" },
    { label: "Others", value: "Others" },
  ];
  const departmentOptions = [
    { label: "Engineering", value: "Engineering" },
    { label: "Product Management", value: "Product Management" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Customer Support", value: "Customer Support" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "Finance", value: "Finance" },
    { label: "Accounting", value: "Accounting" },
    { label: "Operations", value: "Operations" },
    { label: "Legal", value: "Legal" },
    { label: "Administration", value: "Administration" },
    { label: "Information Technology", value: "Information Technology" },
    { label: "DevOps", value: "DevOps" },
    { label: "Quality Assurance", value: "Quality Assurance" },
    { label: "Research and Development", value: "Research and Development" },
    { label: "Data Science", value: "Data Science" },
    { label: "Security", value: "Security" },
    { label: "Procurement", value: "Procurement" },
    { label: "Business Development", value: "Business Development" },
    { label: "Facilities Management", value: "Facilities Management" },
    { label: "Other", value: "Other" },
  ];
  return (
    <div className="flex justify-center items-start min-h-screen bg-sky-200 py-12 px-4">
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
                <SelectBox
                  options={typeOptions}
                  value={getValues("type")}
                  onChange={(v) => {
                    setValue("type", v);
                  }}
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

                <SelectBox
                  options={statusOptions}
                  onChange={(v) => {
                    setValue("status", v);
                  }}
                  value={getValues("status")}
                />

                <p className="text-xs text-red-500 font-medium">
                  {errors.status?.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  Department
                </label>
                <SelectBox
                  options={departmentOptions}
                  onChange={(v) => {
                    setValue("department", v);
                  }}
                  value={getValues("department")}
                />
                <p className="text-xs text-red-500 font-medium">
                  {errors.department?.message}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                Location
              </label>
              <Input
                {...register("location")}
                placeholder="Enter the resource location"
                className="h-11  rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <p className="text-xs text-red-500 font-medium">
                {errors.location?.message}
              </p>
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
