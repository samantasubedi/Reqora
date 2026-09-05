import React, { FC } from "react";
const roleArray = [
  {
    role: "Employee",
    description: "View and collaborate",
    key: "employee",
  },
  {
    role: "Manager",
    description: "Review the resource requests",
    key: "manager",
  },
  {
    role: "Admin",
    description: "Full workspace access",
    key: "admin",
  },
];
const RoleSelector: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ onChange, value }) => {
  return (
    <div className="flex gap-5">
      {roleArray.map((curr) => {
        return (
          <button
            type="button"
            key={curr.role}
            className={`h-20 flex flex-1 cursor-pointer justify-center items-center px-4 py-2 rounded-xl border
                        transition-all duration-200   ${
                          value === curr.role.toLowerCase()
                            ? "bg-teal-800/80 border-teal-500 shadow-md shadow-teal-200"
                            : "bg-white border-teal-100 hover:bg-teal-50 hover:border-teal-300"
                        }`}
            onClick={() => onChange(curr.key)}
          >
            <div>
              <div
                className={`font-semibold text-lg font-sans ${value === curr.role.toLowerCase() ? "text-white" : "text-teal-700"}`}
              >
                {curr.role}
              </div>
              <div
                className={`text-sm ${value === curr.role.toLowerCase() ? "text-teal-100" : "text-slate-400"}`}
              >
                {curr.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
