"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";
import SelectBox from "@/components/others/SelectBox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useAddDepartment,
  useDepartments,
} from "@/app/admin/hooks/companyHooks";

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
  departmentId: z
    .string({ message: "please enter the department" })
    .min(1, "please enter a department"),
  description: z.string().trim().optional(),
});
type formDataType = z.infer<typeof schema>;

type LocationGroup = { location: string; quantity: string };
type LocationMode = "single" | "multiple";

const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "location name must be at least 3 characters"),
});
const locationAssignmentSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("single"), location: locationSchema }),
  z.object({
    mode: z.literal("multiple"),
    locations: z
      .array(
        z.object({
          location: locationSchema,
          quantity: z
            .number()
            .int("quantity must be a whole number")
            .positive("quantity must be a positive integer"),
        }),
      )
      .min(1, "add at least one location"),
  }),
]);

const Page = () => {
  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<formDataType>({ resolver: zodResolver(schema) });

  const quantityValue = useWatch({ control, name: "quantity" });
  const totalQuantity = Number(quantityValue) || 0;

  const [locationMode, setLocationMode] = useState<LocationMode>("single");
  const [singleLocation, setSingleLocation] = useState("");
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([
    { location: "", quantity: "" },
  ]);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments();
  const addDepartmentMutation = useAddDepartment();

  const departmentOptions =
    departmentsData?.departments.map((dept) => ({
      label: dept.name,
      value: dept.id,
    })) ?? [];

  const handleAddDepartment = () => {
    const name = newDepartmentName.trim();
    if (!name) return;
    addDepartmentMutation.mutate(name, {
      onSuccess: (data) => {
        toast.success(data.message);
        setNewDepartmentName("");
      },
      onError: (error: T_MutationError) => {
        toast.error(error.response?.data?.message || error.message);
      },
    });
  };

  const assignedTotal = locationGroups.reduce(
    (sum, g) => sum + (Number(g.quantity) || 0),
    0,
  );
  const remaining = totalQuantity - assignedTotal;

  const addGroup = () =>
    setLocationGroups((prev) => [...prev, { location: "", quantity: "" }]);
  const removeGroup = (index: number) =>
    setLocationGroups((prev) => prev.filter((_, i) => i !== index));
  const updateGroup = (index: number, field: keyof LocationGroup, value: string) =>
    setLocationGroups((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    );

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const postApi = async (data: Record<string, unknown>) => {
    const response = await axios.post(`${backendUrl}/resources`, data, {
      withCredentials: true,
    });
    return response.data;
  };
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      setLocationMode("single");
      setSingleLocation("");
      setLocationGroups([{ location: "", quantity: "" }]);
      router.push("/admin/dashboard");
    },
    onError: (error: T_MutationError) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
  const formSubmitHandler = (data: formDataType) => {
    const locationAssignment =
      locationMode === "single"
        ? { mode: "single" as const, location: { name: singleLocation } }
        : {
            mode: "multiple" as const,
            locations: locationGroups.map((g) => ({
              location: { name: g.location },
              quantity: Number(g.quantity),
            })),
          };

    const parsed = locationAssignmentSchema.safeParse(locationAssignment);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "invalid location assignment");
      return;
    }

    if (locationMode === "multiple") {
      const total = Number(data.quantity);
      if (assignedTotal !== total) {
        if (assignedTotal > total) {
          return;
        }
        toast.error(
          `Remaining ${total - assignedTotal} item${
            total - assignedTotal === 1 ? "" : "s"
          } unassigned`,
        );
        return;
      }
    }

    mutation.mutate({ ...data, locationAssignment: parsed.data });
  };

  const statusOptions = [
    { label: "Available", value: "available" },
    { label: "In use", value: "inUse" },
    { label: "Under Maintenance", value: "underMaintenance" },
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
  const locationModeOptions = [
    { label: "Same location for all items", value: "single" },
    { label: "Multiple locations", value: "multiple" },
  ];

  return (
    <div className="flex justify-center items-start min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-2xl shadow-xl border-border rounded-2xl overflow-hidden bg-card">
        <div className="h-1.5 bg-linear-to-r from-primary to-secondary-foreground" />
        <CardHeader className="text-center px-10 pt-10 pb-6">
          <CardTitle className="text-4xl font-bold tracking-tight text-card-foreground">
            Add Resource
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-1">
            Fill the resource details below
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                Resource Name
              </label>
              <Input
                {...register("resourceName")}
                placeholder="Enter the resource name"
                className="h-11 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <p className="text-xs text-destructive font-medium">
                {errors.resourceName?.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Quantity
                </label>
                <Input
                  {...register("quantity")}
                  placeholder="e.g. 10"
                  type="number"
                  min={1}
                  className="h-11 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
                <p className="text-xs text-destructive font-medium">
                  {errors.quantity?.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Type
                </label>
                <SelectBox
                  label="type"
                  options={typeOptions}
                  value={getValues("type")}
                  onChange={(v) => {
                    setValue("type", v);
                  }}
                />
                <p className="text-xs text-destructive font-medium">
                  {errors.type?.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Status
                </label>

                <SelectBox
                  label="status"
                  options={statusOptions}
                  onChange={(v) => {
                    setValue("status", v);
                  }}
                  value={getValues("status")}
                />

                <p className="text-xs text-destructive font-medium">
                  {errors.status?.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Department
                </label>
                <SelectBox
                  label="department"
                  options={departmentOptions}
                  onChange={(v) => {
                    setValue("departmentId", v);
                  }}
                  value={getValues("departmentId")}
                />
                <p className="text-xs text-destructive font-medium">
                  {errors.departmentId?.message}
                </p>
                {departmentsLoading && (
                  <p className="text-xs text-muted-foreground">
                    Loading departments...
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Add a new department"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    className="flex-1 h-9 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddDepartment}
                    disabled={
                      !newDepartmentName.trim() || addDepartmentMutation.isPending
                    }
                    className="h-9 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addDepartmentMutation.isPending ? "Adding..." : "Add Dept"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                Location Assignment
              </label>
              <SelectBox
                label="location mode"
                options={locationModeOptions}
                value={locationMode}
                onChange={(v) => setLocationMode(v as LocationMode)}
              />
            </div>

            {locationMode === "single" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Location
                </label>
                <Input
                  placeholder="Enter the resource location"
                  value={singleLocation}
                  onChange={(e) => setSingleLocation(e.target.value)}
                  className="h-11 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
                {totalQuantity > 0 && (
                  <p className="text-xs text-muted-foreground">
                    This location will be applied to all {totalQuantity} item{totalQuantity !== 1 && "s"}.
                  </p>
                )}
              </div>
            )}

            {locationMode === "multiple" && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Locations
                </label>
                <div className="space-y-2">
                  {locationGroups.map((group, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Location name"
                        value={group.location}
                        onChange={(e) =>
                          updateGroup(index, "location", e.target.value)
                        }
                        className="flex-1 h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                      <Input
                        placeholder="Qty"
                        type="number"
                        min={1}
                        value={group.quantity}
                        onChange={(e) =>
                          updateGroup(index, "quantity", e.target.value)
                        }
                        className="w-24 h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                      {locationGroups.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroup(index)}
                          className="h-10 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGroup}
                  className="h-9"
                >
                  + Add location group
                </Button>
                {totalQuantity > 0 && (
                  <div className="space-y-1 text-sm pt-1">
                    <div className="flex items-center gap-4">
                      <span className="text-card-foreground font-medium">
                        Assigned: {assignedTotal} / {totalQuantity}
                      </span>
                      <span
                        className={
                          remaining === 0
                            ? "text-green-600 font-medium"
                            : remaining > 0
                              ? "text-yellow-600 font-medium"
                              : "text-destructive font-medium"
                        }
                      >
                        {remaining === 0
                          ? "All items assigned"
                          : `Remaining: ${remaining}`}
                      </span>
                    </div>
                    {assignedTotal > totalQuantity && (
                      <p className="text-xs text-destructive font-medium">
                        Assigned quantity ({assignedTotal}) exceeds total
                        quantity ({totalQuantity}).
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                Description
              </label>
              <Input
                {...register("description")}
                placeholder="Write a description about the resource (optional)"
                className="h-11 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <p className="text-xs text-destructive font-medium">
                {errors.description?.message}
              </p>
            </div>

            {errors.root?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.root.message}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-11 cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Submitting..." : "Submit Resource"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
