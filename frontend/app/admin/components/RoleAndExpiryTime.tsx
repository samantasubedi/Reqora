import React from "react";
import {
  FieldErrors,
  useForm,
  useFormContext,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { emailInviteFormType } from "./EmailInviteForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
type valuesType = {
  role: string;
  expiryTime: number;
};
type propType = {
  onChange: (values: valuesType) => void;
  values: valuesType;
  errors: {
    roleError?: string;
    expiryTimeError?: string;
  };
};
const RoleAndExpiryTime = ({ onChange, values, errors }: propType) => {
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
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-card-foreground">Role</label>

        <div className="flex gap-5">
          {roleArray.map((curr) => {
            return (
              <button
                type="button"
                key={curr.role}
                className={`h-20 flex flex-1 cursor-pointer justify-center items-center px-4 py-2 rounded-xl border
                        transition-all duration-200
                        ${
                          values.role === curr.role.toLowerCase()
                            ? "bg-primary border-primary shadow-md shadow-primary/30"
                            : "bg-card border-border hover:bg-accent hover:border-primary"
                        }`}
                onClick={() => {
                  values.role = curr.role.toLowerCase();
                  onChange(values);
                }}
              >
                <div>
                  <div
                    className={`font-semibold text-lg font-sans ${values.role === curr.role.toLowerCase() ? "text-primary-foreground" : "text-primary"}`}
                  >
                    {curr.role}
                  </div>
                  <div
                    className={`text-sm ${values.role === curr.role.toLowerCase() ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {curr.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-destructive">{errors?.roleError}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-card-foreground">Expiry Time</label>
        <div>
          <RadioGroup
            onValueChange={(value) => {
              values.expiryTime = Number(value);
              onChange(values);
            }}
            className="flex w-full justify-between bg-card p-2 rounded-lg"
          >
            <div className="flex text-foreground items-center gap-2">
              <RadioGroupItem
                value="180000"
                className="border border-primary text-primary"
              />
              <label className="font-semibold">3 min</label>
            </div>
            <div className="flex text-foreground items-center gap-2">
              <RadioGroupItem
                value="300000"
                className="border border-primary text-primary"
              />
              <label className="font-semibold">5 min</label>
            </div>
            <div className="flex text-foreground items-center gap-2">
              <RadioGroupItem
                value="600000"
                className="border border-primary text-primary"
              />
              <label className="font-semibold">10 min</label>
            </div>
            <div className="flex text-foreground items-center gap-2">
              <RadioGroupItem
                value="1800000"
                className="border border-primary text-primary"
              />
              <label className="font-semibold">30 min</label>
            </div>
            <div className="flex text-foreground items-center gap-2">
              <RadioGroupItem
                value="3600000"
                className="border border-primary text-primary"
              />
              <label className="font-semibold">1 hr</label>
            </div>
          </RadioGroup>
        </div>
        <p className="text-sm text-destructive">{errors?.expiryTimeError}</p>
      </div>
    </div>
  );
};

export default RoleAndExpiryTime;
