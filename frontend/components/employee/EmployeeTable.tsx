import React from "react";

export const EmployeeTable = () => {
  const employees = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Employee",
      department: "IT",
      joined: "Jan 12, 2026",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Manager",
      department: "HR",
      joined: "Feb 2, 2026",
    },
    {
      id: 3,
      name: "Mike Brown",
      email: "mike@example.com",
      role: "Employee",
      department: "Finance",
      joined: "Mar 8, 2026",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Employee",
      department: "Operations",
      joined: "Apr 15, 2026",
    },
  ];
  return (
    <div>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row">
        <input
          placeholder="Search employees..."
          className="flex-1 rounded-lg border px-3 py-2 outline-none"
        />

        <select className="rounded-lg border px-3 py-2">
          <option>All Roles</option>
          <option>Employee</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>

        <select className="rounded-lg border px-3 py-2">
          <option>All Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium">
                Department
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium">
                Joined
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
                      {employee.name.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      employee.role === "Manager"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {employee.role}
                  </span>
                </td>

                <td className="px-6 py-4">{employee.department}</td>

                <td className="px-6 py-4">{employee.joined}</td>

                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
