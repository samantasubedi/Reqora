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
// type propType = {
//   setValue: UseFormSetValue<emailInviteFormType>;
//   register: UseFormRegister<emailInviteFormType>;
//   errors: FieldErrors<emailInviteFormType>;
//   watch: UseFormWatch<emailInviteFormType>;
// };
const RoleAndExpiryTime = () => {
  const form = useFormContext<emailInviteFormType>();
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = form;
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
  const selectedRole = watch("role");
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-teal-800">Role</label>
        <input type="hidden" {...register("role")} />
        <div className="flex gap-5">
          {roleArray.map((curr) => {
            return (
              <button
                type="button"
                key={curr.role}
                className={`h-20 flex flex-1 justify-center items-center px-4 py-2 rounded-xl border
                        transition-all duration-200
                        ${
                          selectedRole === curr.role.toLowerCase()
                            ? "bg-teal-800/80 border-teal-500 shadow-md shadow-teal-200"
                            : "bg-white border-teal-100 hover:bg-teal-50 hover:border-teal-300"
                        }`}
                onClick={() => setValue("role", curr.role.toLowerCase())}
              >
                <div>
                  <div
                    className={`font-semibold text-lg font-sans ${selectedRole === curr.role.toLowerCase() ? "text-white" : "text-teal-700"}`}
                  >
                    {curr.role}
                  </div>
                  <div
                    className={`text-sm ${selectedRole === curr.role.toLowerCase() ? "text-teal-100" : "text-slate-400"}`}
                  >
                    {curr.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-red-500">{errors.role?.message}</p>
      </div>
      <input type="hidden" {...register("expiryTime")}></input>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium text-teal-800">Expiry Time</label>
        <div>
          <RadioGroup
            value={String(watch("expiryTime"))}
            className="flex w-full justify-between bg-white p-2 rounded-lg"
            onValueChange={(value) => {
              setValue("expiryTime", Number(value));
            }}
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
        <p className="text-sm text-red-500">{errors.expiryTime?.message}</p>
      </div>
    </div>
  );
};

export default RoleAndExpiryTime;
