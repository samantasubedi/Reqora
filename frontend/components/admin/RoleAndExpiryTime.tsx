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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
        <label className="text-md font-medium text-teal-800">Role</label>

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
                            ? "bg-teal-800/80 border-teal-500 shadow-md shadow-teal-200"
                            : "bg-white border-teal-100 hover:bg-teal-50 hover:border-teal-300"
                        }`}
                onClick={() => {
                  values.role = curr.role.toLowerCase();
                  onChange(values);
                }}
              >
                <div>
                  <div
                    className={`font-semibold text-lg font-sans ${values.role === curr.role.toLowerCase() ? "text-white" : "text-teal-700"}`}
                  >
                    {curr.role}
                  </div>
                  <div
                    className={`text-sm ${values.role === curr.role.toLowerCase() ? "text-teal-100" : "text-slate-400"}`}
                  >
                    {curr.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-red-500">{errors?.roleError}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-teal-800">Expiry Time</label>
        <div>
          <RadioGroup
            onValueChange={(value) => {
              values.expiryTime = Number(value);
              onChange(values);
            }}
            className="flex w-full justify-between bg-white p-2 rounded-lg"
          >
            <div className="flex text-teal-800 items-center gap-2">
              <RadioGroupItem
                value="180000"
                className="border border-teal-600 text-teal-600"
              />
              <label className="font-semibold">3 min</label>
            </div>
            <div className="flex text-teal-800 items-center gap-2">
              <RadioGroupItem
                value="300000"
                className="border border-teal-600 text-teal-600"
              />
              <label className="font-semibold">5 min</label>
            </div>
            <div className="flex text-teal-800 items-center gap-2">
              <RadioGroupItem
                value="600000"
                className="border border-teal-600 text-teal-600"
              />
              <label className="font-semibold">10 min</label>
            </div>
            <div className="flex text-teal-800 items-center gap-2">
              <RadioGroupItem
                value="1800000"
                className="border border-teal-600 text-teal-600"
              />
              <label className="font-semibold">30 min</label>
            </div>
            <div className="flex text-teal-800 items-center gap-2">
              <RadioGroupItem
                value="3600000"
                className="border border-teal-600 text-teal-600"
              />
              <label className="font-semibold">1 hr</label>
            </div>
          </RadioGroup>
        </div>
        <p className="text-sm text-red-500">{errors?.expiryTimeError}</p>
      </div>
    </div>
  );
};

export default RoleAndExpiryTime;
