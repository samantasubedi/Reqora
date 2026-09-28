"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/apiClient";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SelectBox from "@/components/others/SelectBox";
import { T_MutationError } from "@/types/global";
import {
  Building2,
  Check,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { GetStartedShell } from "../components/GetStartedShell";

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
  "text-xs font-bold uppercase tracking-widest text-muted-foreground";
const inputClass = "h-11 rounded-xl";
const errorClass = "text-xs font-medium text-destructive";

const adminPerks = [
  {
    icon: ShieldCheck,
    title: "You become the admin",
    text: "Full control over departments, users, roles, and the resource catalog.",
  },
  {
    icon: Users,
    title: "Bring your team next",
    text: "Invite by email or share a join code right after setup — step 3 guides you.",
  },
  {
    icon: Building2,
    title: "Scoped by department",
    text: "Resources, requests, and approvals stay organized per department from day one.",
  },
];

const Page = () => {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const guard = async () => {
      try {
        const userInfo = await api.post(`/isloggedin`, null);
        if (userInfo.data.code === "LOGGEDIN") {
          if (userInfo.data.role) {
            router.push(`/${userInfo.data.role}/dashboard`);
            return;
          }
        } else {
          router.push(
            `/login?next=${encodeURIComponent("/getstarted/createcompany")}`
          );
          return;
        }
      } catch {
        router.push(
          `/login?next=${encodeURIComponent("/getstarted/createcompany")}`
        );
        return;
      }
      setAuthChecking(false);
    };
    guard();
  }, [router]);

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
    const response = await api.post(`/createcompany`, data);
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

  const aside = (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-7">
      <p className="text-sm font-bold tracking-widest text-primary uppercase">
        Why create first
      </p>
      <p className="mt-2 text-lg font-bold text-card-foreground">
        One workspace for every request
      </p>
      <ul className="mt-5 space-y-5">
        {adminPerks.map((perk) => (
          <li key={perk.title} className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <perk.icon className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-card-foreground">
                {perk.title}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                {perk.text}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-xs font-medium text-muted-foreground">
        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Takes about two minutes — you can edit every detail later from your
        admin dashboard.
      </div>
    </div>
  );

  return (
    <GetStartedShell
      badge="Step 2 of 3 — Set up your company"
      title={
        <>
          Create your{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            company workspace
          </span>
        </>
      }
      subtitle="Tell us about your company. You'll become its first administrator."
      step={2}
      backHref="/getstarted"
      backLabel="Back to options"
      aside={aside}
      maxWidth="max-w-6xl"
    >
      {authChecking ? (
        <div className="flex justify-center rounded-2xl border bg-card py-16 shadow-sm">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-7"
            >
              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Business details
                </p>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Company name</label>
                  <Input
                    className={inputClass}
                    placeholder="Acme Pvt. Ltd."
                    autoComplete="organization"
                    {...register("companyName")}
                  />
                  {errors.companyName?.message && (
                    <p className={errorClass}>{errors.companyName.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                      <p className={errorClass}>{errors.industry.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Company size</label>
                    <Input
                      className={inputClass}
                      type="number"
                      min={1}
                      placeholder="e.g. 50"
                      autoComplete="organization-size"
                      {...register("size")}
                    />
                    {errors.size?.message && (
                      <p className={errorClass}>{errors.size.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Contact details
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Company email</label>
                    <Input
                      className={inputClass}
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email?.message && (
                      <p className={errorClass}>{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Phone number{" "}
                      <span className="font-medium normal-case text-muted-foreground">
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
                      <p className={errorClass}>{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Address</label>
                  <Input
                    className={inputClass}
                    placeholder="Street, city, country"
                    autoComplete="street-address"
                    {...register("address")}
                  />
                  {errors.address?.message && (
                    <p className={errorClass}>{errors.address.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Website{" "}
                    <span className="font-medium normal-case text-muted-foreground">
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
                    <p className={errorClass}>{errors.website.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="h-12 w-full cursor-pointer rounded-xl border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  "Create company workspace"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </GetStartedShell>
  );
};

export default Page;
