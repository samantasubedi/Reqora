"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { T_MutationError } from "@/types/global";
import SelectBox from "@/components/others/SelectBox";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  useAddDepartment,
  useDepartments,
} from "@/app/admin/hooks/companyHooks";
import { Plus, X } from "lucide-react";
type formInputType = z.input<typeof schema>;

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
  departmentId: z
    .string({ message: "please enter the department" })
    .min(1, "please enter a department"),
  description: z.string().trim().optional(),
});
type formDataType = z.infer<typeof schema>;

type LocationGroup = { location: string; quantity: string };
type LocationMode = "single" | "multiple";

const locationSchema = z.object({
  name: z.string().trim().min(3, "location name must be at least 3 characters"),
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

type StatusGroup = { status: string; quantity: string };
type StatusMode = "same" | "different";

const statusEntrySchema = z.object({
  status: z.string().trim().min(1, "please select a status"),
  quantity: z.coerce
    .number()
    .int("quantity must be a whole number")
    .positive("quantity must be a positive integer"),
});
const statusAssignmentSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("same"),
    status: z.string().trim().min(1, "please select a status"),
  }),
  z.object({
    mode: z.literal("different"),
    statuses: z.array(statusEntrySchema).min(1, "add at least one status"),
  }),
]);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4 rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
    <div className="flex items-center gap-2">
      <span className="h-5 w-1.5 rounded-full bg-primary" />
      <h3 className="text-sm font-semibold uppercase tracking-wide text-card-foreground">
        {title}
      </h3>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const SegmentedControl = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex w-full rounded-lg border border-border bg-background p-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${
          value === opt.value
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-card-foreground"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const AssignmentProgress = ({
  assigned,
  total,
}: {
  assigned: number;
  total: number;
}) => {
  const remaining = total - assigned;
  const percentage =
    total > 0 ? Math.min(100, Math.round((assigned / total) * 100)) : 0;
  return (
    <div className="space-y-1.5 pt-1">
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-card-foreground font-medium">
          Assigned: {assigned} / {total}
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
      {assigned > total && (
        <p className="text-xs text-destructive font-medium">
          Assigned quantity ({assigned}) exceeds total quantity ({total}).
        </p>
      )}
    </div>
  );
};

const Page = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<formInputType, any, formDataType>({
    resolver: zodResolver(schema),
  });

  const quantityValue = useWatch({ control, name: "quantity" });
  const totalQuantity = Number(quantityValue) || 0;

  const [locationMode, setLocationMode] = useState<LocationMode>("single");
  const [singleLocation, setSingleLocation] = useState("");
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([
    { location: "", quantity: "" },
  ]);
  const [statusMode, setStatusMode] = useState<StatusMode>("same");
  const [singleStatus, setSingleStatus] = useState("");
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([
    { status: "", quantity: "" },
  ]);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments();
  const addDepartmentMutation = useAddDepartment();

  const departmentOptions =
    departmentsData?.departments?.map((dept) => ({
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

  const statusAssignedTotal = statusGroups.reduce(
    (sum, g) => sum + (Number(g.quantity) || 0),
    0,
  );

  const addGroup = () =>
    setLocationGroups((prev) => [...prev, { location: "", quantity: "" }]);
  const removeGroup = (index: number) =>
    setLocationGroups((prev) => prev.filter((_, i) => i !== index));
  const updateGroup = (
    index: number,
    field: keyof LocationGroup,
    value: string,
  ) =>
    setLocationGroups((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    );

  const addStatusGroup = () =>
    setStatusGroups((prev) => [...prev, { status: "", quantity: "" }]);
  const removeStatusGroup = (index: number) =>
    setStatusGroups((prev) => prev.filter((_, i) => i !== index));
  const updateStatusGroup = (
    index: number,
    field: keyof StatusGroup,
    value: string,
  ) =>
    setStatusGroups((prev) =>
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
      setStatusMode("same");
      setSingleStatus("");
      setStatusGroups([{ status: "", quantity: "" }]);
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
      toast.error(
        parsed.error.issues[0]?.message || "invalid location assignment",
      );
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

    const statusAssignment =
      statusMode === "same"
        ? { mode: "same" as const, status: singleStatus }
        : {
            mode: "different" as const,
            statuses: statusGroups.map((g) => ({
              status: g.status,
              quantity: Number(g.quantity),
            })),
          };

    const parsedStatus = statusAssignmentSchema.safeParse(statusAssignment);
    if (!parsedStatus.success) {
      toast.error(
        parsedStatus.error.issues[0]?.message || "invalid status assignment",
      );
      return;
    }

    if (statusMode === "different") {
      const total = Number(data.quantity);
      if (statusAssignedTotal !== total) {
        if (statusAssignedTotal > total) {
          return;
        }
        toast.error(
          `Remaining ${total - statusAssignedTotal} item${
            total - statusAssignedTotal === 1 ? "" : "s"
          } unassigned`,
        );
        return;
      }
    }

    mutation.mutate({
      ...data,
      statusAssignment: parsedStatus.data,
      locationAssignment: parsed.data,
    });
  };

  const statusOptions = [
    { label: "Available", value: "available" },
    { label: "In use", value: "inUse" },
    { label: "Under Maintenance", value: "underMaintenance" },
  ];
  const statusModeOptions = [
    { label: "Same status for all items", value: "same" },
    { label: "Different statuses", value: "different" },
  ];
  const availableStatusOptionsFor = (index: number) =>
    statusOptions.filter(
      (o) =>
        o.value === statusGroups[index].status ||
        !statusGroups.some((g, i) => i !== index && g.status === o.value),
    );
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
      <Card className="w-full max-w-3xl! shadow-xl border-border rounded-2xl overflow-hidden bg-card">
        <div className="h-1.5 bg-linear-to-r from-primary to-secondary-foreground" />
        <CardHeader className="text-center px-10 pt-10 pb-6 border-b border-border">
          <CardTitle className="text-4xl font-bold tracking-tight text-card-foreground">
            Add Resource
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-1">
            Fill the resource details below
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10 pt-8">
          <form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="space-y-6"
          >
            <Section title="Basic Details">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                  Resource Name
                </label>
                <Input
                  {...register("resourceName")}
                  placeholder="Enter the resource name"
                  className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                    className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                    className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <p className="text-xs text-destructive font-medium">
                    {errors.type?.message}
                  </p>
                </div>
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
                  className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                    className="flex-1 h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddDepartment}
                    disabled={
                      !newDepartmentName.trim() || addDepartmentMutation.isPending
                    }
                    className="h-10 shrink-0 cursor-pointer rounded-lg border-border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus />
                    {addDepartmentMutation.isPending ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </Section>

            <Section title="Location Assignment">
              <SegmentedControl
                options={locationModeOptions}
                value={locationMode}
                onChange={(v) => setLocationMode(v as LocationMode)}
              />

              {locationMode === "single" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                    Location
                  </label>
                  <Input
                    placeholder="Enter the resource location"
                    value={singleLocation}
                    onChange={(e) => setSingleLocation(e.target.value)}
                    className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  {totalQuantity > 0 && (
                    <p className="text-xs text-muted-foreground">
                      This location will be applied to all {totalQuantity} item
                      {totalQuantity !== 1 && "s"}.
                    </p>
                  )}
                </div>
              )}

              {locationMode === "multiple" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {locationGroups.map((group, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
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
                            size="icon"
                            onClick={() => removeGroup(index)}
                            aria-label="Remove location group"
                            className="h-10 w-10 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X />
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
                    className="h-10 w-full cursor-pointer rounded-lg border-dashed border-border"
                  >
                    <Plus />
                    Add location
                  </Button>
                  {totalQuantity > 0 && (
                    <AssignmentProgress
                      assigned={assignedTotal}
                      total={totalQuantity}
                    />
                  )}
                </div>
              )}
            </Section>

            <Section title="Status Assignment">
              <SegmentedControl
                options={statusModeOptions}
                value={statusMode}
                onChange={(v) => setStatusMode(v as StatusMode)}
              />

              {statusMode === "same" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-card-foreground tracking-wide uppercase">
                    Status
                  </label>
                  <SelectBox
                    label="status"
                    options={statusOptions}
                    onChange={(v) => setSingleStatus(v)}
                    value={singleStatus}
                    className="h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  {totalQuantity > 0 && (
                    <p className="text-xs text-muted-foreground">
                      This status will be applied to all {totalQuantity} item
                      {totalQuantity !== 1 && "s"}.
                    </p>
                  )}
                </div>
              )}

              {statusMode === "different" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {statusGroups.map((group, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <SelectBox
                          label="status"
                          options={availableStatusOptionsFor(index)}
                          value={group.status}
                          onChange={(v) =>
                            updateStatusGroup(index, "status", v)
                          }
                          className="flex-1 h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                        <Input
                          placeholder="Qty"
                          type="number"
                          min={1}
                          value={group.quantity}
                          onChange={(e) =>
                            updateStatusGroup(index, "quantity", e.target.value)
                          }
                          className="w-24 h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                        {statusGroups.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStatusGroup(index)}
                            aria-label="Remove status group"
                            className="h-10 w-10 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStatusGroup}
                    className="h-10 w-full cursor-pointer rounded-lg border-dashed border-border"
                  >
                    <Plus />
                    Add status
                  </Button>
                  {totalQuantity > 0 && (
                    <AssignmentProgress
                      assigned={statusAssignedTotal}
                      total={totalQuantity}
                    />
                  )}
                </div>
              )}
            </Section>

            <Section title="Description">
              <div className="space-y-1.5">
                <Textarea
                  {...register("description")}
                  placeholder="Write a description about the resource (optional)"
                  rows={4}
                  className="rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
                <p className="text-xs text-destructive font-medium">
                  {errors.description?.message}
                </p>
              </div>
            </Section>

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
