import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectBox from "@/components/others/SelectBox";
import { useDepartments } from "@/app/admin/hooks/companyHooks";

type valuesType = {
  role: string;
  expiryTime: number;
  departmentId: string;
};
type propType = {
  onChange: (values: valuesType) => void;
  values: valuesType;
  errors: {
    roleError?: string;
    expiryTimeError?: string;
    departmentIdError?: string;
  };
};

const fieldLabel =
  "text-sm font-semibold uppercase tracking-wide text-card-foreground";
const selectClass =
  "h-10 rounded-lg border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition";

const roleArray = [
  {
    role: "Employee",
    description: "View and collaborate",
  },
  {
    role: "Manager",
    description: "Review the resource requests",
  },
  {
    role: "Admin",
    description: "Full workspace access",
  },
];

const expiryOptions = [
  { value: "180000", label: "3 min" },
  { value: "300000", label: "5 min" },
  { value: "600000", label: "10 min" },
  { value: "1800000", label: "30 min" },
  { value: "3600000", label: "1 hr" },
];

const RoleAndExpiryTime = ({ onChange, values, errors }: propType) => {
  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments();
  const departmentOptions =
    departmentsData?.departments?.map((dept) => ({
      label: dept.name,
      value: dept.id,
    })) ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className={fieldLabel}>Role</label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {roleArray.map((curr) => {
            const selected = values.role === curr.role.toLowerCase();
            return (
              <button
                type="button"
                key={curr.role}
                className={`flex min-h-20 w-full cursor-pointer items-center justify-center rounded-xl border px-4 py-2 transition-all duration-200 ${
                  selected
                    ? "bg-primary border-primary shadow-md shadow-primary/30"
                    : "bg-card border-border hover:bg-accent hover:border-primary"
                }`}
                onClick={() => {
                  onChange({ ...values, role: curr.role.toLowerCase() });
                }}
              >
                <div>
                  <div
                    className={`font-semibold text-lg font-sans ${selected ? "text-primary-foreground" : "text-primary"}`}
                  >
                    {curr.role}
                  </div>
                  <div
                    className={`text-sm ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {curr.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors?.roleError && (
          <p className="text-xs font-medium text-destructive">
            {errors.roleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabel}>Expiry Time</label>
        <RadioGroup
          value={values.expiryTime ? String(values.expiryTime) : ""}
          onValueChange={(value) => {
            onChange({ ...values, expiryTime: Number(value) });
          }}
          className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2 sm:grid-cols-5"
        >
          {expiryOptions.map((opt) => {
            const selected = String(values.expiryTime) === opt.value;
            return (
              <div
                key={opt.value}
                className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 transition ${
                  selected ? "border-primary bg-primary/10" : "border-transparent"
                }`}
              >
                <RadioGroupItem
                  id={`expiry-${opt.value}`}
                  value={opt.value}
                  className="border border-primary text-primary"
                />
                <label
                  htmlFor={`expiry-${opt.value}`}
                  className={`cursor-pointer text-sm font-semibold ${
                    selected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </label>
              </div>
            );
          })}
        </RadioGroup>
        {errors?.expiryTimeError && (
          <p className="text-xs font-medium text-destructive">
            {errors.expiryTimeError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabel}>Department</label>
        <SelectBox
          label="department"
          options={departmentOptions}
          value={values.departmentId}
          onChange={(v) => {
            onChange({ ...values, departmentId: v });
          }}
          className={selectClass}
        />
        {departmentsLoading && (
          <p className="text-xs text-muted-foreground">
            Loading departments...
          </p>
        )}
        {errors?.departmentIdError && (
          <p className="text-xs font-medium text-destructive">
            {errors.departmentIdError}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleAndExpiryTime;
