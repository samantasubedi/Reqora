"use client";
import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectBox from "@/components/others/SelectBox";
import { TableError } from "../TableError";
import { useCompany, useUpdateCompany } from "../../hooks/companyHooks";
import type { CompanyIndustry } from "../../apis/companyApi";
import type { T_MutationError } from "@/types/global";

const INDUSTRY_OPTIONS = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Construction", value: "construction" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Legal", value: "legal" },
  { label: "Other", value: "other" },
];

const schema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .min(3, "Company name must be at least 3 characters"),
  email: z.email("Please enter a valid company email"),
  size: z
    .number({ message: "Company size is required" })
    .int("Company size must be a whole number")
    .min(1, "Company size is required"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(3, "Address must be at least 3 characters"),
  industry: z.string().min(1, "Please select an industry"),
  website: z
    .union([
      z.url({ message: "Please enter a valid website URL" }),
      z.literal(""),
    ])
    .optional(),
  phoneNumber: z
    .union([
      z
        .string()
        .regex(/^\+?[0-9()\s\-]{7,20}$/, "Please enter a valid phone number"),
      z.literal(""),
    ])
    .optional(),
});
type FormValues = z.infer<typeof schema>;

const labelClass = "text-sm font-medium";
const errorClass = "text-xs font-medium text-destructive";
const inputClass = "h-11";

const CompanyProfileForm = () => {
  const { data, isLoading, isError, refetch } = useCompany();
  const updateCompany = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      email: "",
      size: 1,
      address: "",
      industry: "",
      website: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (!data?.data) return;
    const company = data.data;
    reset({
      companyName: company.companyName,
      email: company.email,
      size: company.size,
      address: company.address,
      industry: company.industry ?? "",
      website: company.website ?? "",
      phoneNumber: company.phoneNumber ?? "",
    });
  }, [data, reset]);

  const industry = useWatch({ control, name: "industry" });

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl border bg-card" />;
  }

  if (isError || !data?.data) {
    return (
      <TableError
        title="Unable to load company profile"
        message="We couldn't load your company details. Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const company = data.data;

  const onSubmit = (values: FormValues) => {
    updateCompany.mutate(
      {
        companyName: values.companyName,
        email: values.email,
        size: values.size,
        address: values.address,
        industry: values.industry as CompanyIndustry,
        website: values.website ?? "",
        phoneNumber: values.phoneNumber ?? "",
      },
      {
        onSuccess: (response) => toast.success(response.message),
        onError: (error: T_MutationError) =>
          toast.error(error.response?.data?.message ?? error.message),
      },
    );
  };

  return (
    <Card className="max-w-4xl shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <CardTitle>Company profile</CardTitle>
            <CardDescription>
              This information is shown across your workspace.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="companyName">
              Company name
            </label>
            <Input
              id="companyName"
              {...register("companyName")}
              className={inputClass}
              placeholder="Enter company name"
            />
            {errors.companyName?.message && (
              <p className={errorClass}>{errors.companyName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="companyEmail">
              Company email
            </label>
            <Input
              id="companyEmail"
              type="email"
              {...register("email")}
              className={inputClass}
              placeholder="company@example.com"
            />
            {errors.email?.message && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="size">
              Company size
            </label>
            <Input
              id="size"
              type="number"
              min={1}
              {...register("size", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.size?.message && (
              <p className={errorClass}>{errors.size.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Industry</label>
            <SelectBox
              label="industry"
              value={industry}
              options={INDUSTRY_OPTIONS}
              onChange={(value) =>
                setValue("industry", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            {errors.industry?.message && (
              <p className={errorClass}>{errors.industry.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="phoneNumber">
              Phone number
            </label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              className={inputClass}
              placeholder="+1 555 000 0000"
            />
            {errors.phoneNumber?.message && (
              <p className={errorClass}>{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="website">
              Website
            </label>
            <Input
              id="website"
              {...register("website")}
              className={inputClass}
              placeholder="https://example.com"
            />
            {errors.website?.message && (
              <p className={errorClass}>{errors.website.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Address
            </label>
            <Textarea
              id="address"
              {...register("address")}
              rows={3}
              placeholder="Enter company address"
            />
            {errors.address?.message && (
              <p className={errorClass}>{errors.address.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Last updated{" "}
            {new Date(company.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <Button
            type="submit"
            disabled={updateCompany.isPending || !isDirty}
          >
            {updateCompany.isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyProfileForm;
