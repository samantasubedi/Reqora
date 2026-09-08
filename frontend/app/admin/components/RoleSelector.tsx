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
                            ? "bg-primary border-primary shadow-md shadow-primary/30"
                            : "bg-card border-border hover:bg-accent hover:border-primary"
                        }`}
            onClick={() => onChange(curr.key)}
          >
            <div>
              <div
                className={`font-semibold text-lg font-sans ${value === curr.role.toLowerCase() ? "text-primary-foreground" : "text-primary"}`}
              >
                {curr.role}
              </div>
              <div
                className={`text-sm ${value === curr.role.toLowerCase() ? "text-primary-foreground/80" : "text-muted-foreground"}`}
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
