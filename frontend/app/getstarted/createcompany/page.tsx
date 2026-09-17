"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Navbar from "@/components/others/Navbar";
import SelectBox from "@/components/others/SelectBox";
import { T_MutationError } from "@/types/global";

const schema = z.object({
  companyName: z
    .string({ message: "Company name is required" })
    .trim()
    .min(1, "Company name is required")
    .min(3, "Company name must be at least 3 characters"),
  industry: z.string().min(1, "Please select an industry"),
  size: z.coerce
    .number({ message: "Company size is required" })
    .int()
    .min(1, "Company size is required"),
  email: z
    .email({ message: "Please enter a valid company email" })
    .trim()
    .min(1, "Company email is required"),
  address: z
    .string({ message: "Address is required" })
    .trim()
    .min(1, "Address is required")
    .min(3, "Address must be at least 3 characters"),
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
type formData = z.infer<typeof schema>;

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

const labelClass =
  "text-sm font-semibold uppercase tracking-wide text-card-foreground";
const inputClass =
  "h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition";
const sectionClass =
  "text-xs font-bold uppercase tracking-widest text-muted-foreground";

const Page = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const {
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      industry: "",
      website: "",
      phoneNumber: "",
    },
  });

  const postApi = async (data: formData) => {
    const response = await axios.post(`${backendUrl}/createcompany`, data, {
      withCredentials: true,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      if (data.success && data.code == "COMPANY_CREATED")
        toast.success(data.message);
      router.push("/admin/dashboard");
    },
    onError: (error: T_MutationError) => {
      if (error.response?.data.code == "DUPLICATE_EMAIL") {
        setError("email", { message: error.response.data.message });
      }
      toast.error(error.response?.data.message || error.message);
    },
  });

  const handleFormSubmit: SubmitHandler<formData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center px-4 py-10">
        <div className="mx-auto w-full max-w-2xl">
          <Card className="w-full rounded-2xl border-border shadow-xl">
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-card-foreground">
                Create Your Company
              </CardTitle>
              <CardDescription className="mx-auto max-w-md text-base">
                Set up your workspace to start managing resources and requests.
                You&apos;ll be its first administrator.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <p className={sectionClass}>Business details</p>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Company Name</label>
                    <Input
                      className={inputClass}
                      placeholder="Enter your company name"
                      autoComplete="organization"
                      {...register("companyName")}
                    />
                    {errors.companyName?.message && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Industry</label>
                    <SelectBox
                      label="industry"
                      value={watch("industry") ?? ""}
                      onChange={(val) =>
                        setValue("industry", val, { shouldValidate: true })
                      }
                      options={INDUSTRY_OPTIONS}
                      className={inputClass}
                    />
                    {errors.industry?.message && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Company Size</label>
                    <Input
                      className={inputClass}
                      type="number"
                      min={1}
                      placeholder="Number of employees (e.g. 50)"
                      autoComplete="organization-size"
                      {...register("size")}
                    />
                    {errors.size?.message && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.size.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className={sectionClass}>Contact details</p>

                  <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Company Email</label>
                      <Input
                        className={inputClass}
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        {...register("email")}
                      />
                      {errors.email?.message && (
                        <p className="text-xs font-medium text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>
                        Phone Number{" "}
                        <span className="font-normal normal-case text-muted-foreground">
                          (optional)
                        </span>
                      </label>
                      <Input
                        className={inputClass}
                        type="tel"
                        placeholder="+977-XXXXXXXXXX"
                        autoComplete="tel"
                        {...register("phoneNumber")}
                      />
                      {errors.phoneNumber?.message && (
                        <p className="text-xs font-medium text-destructive">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Address</label>
                    <Input
                      className={inputClass}
                      placeholder="Enter your company address"
                      autoComplete="street-address"
                      {...register("address")}
                    />
                    {errors.address?.message && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Website{" "}
                      <span className="font-normal normal-case text-muted-foreground">
                        (optional)
                      </span>
                    </label>
                    <Input
                      className={inputClass}
                      type="url"
                      placeholder="https://example.com"
                      autoComplete="url"
                      {...register("website")}
                    />
                    {errors.website?.message && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-11 w-full cursor-pointer rounded-lg bg-primary font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mutation.isPending ? "Creating..." : "Create Company"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Page;