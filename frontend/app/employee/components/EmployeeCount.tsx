import React from "react";

const EmployeeCount = () => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold">48</h2>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Employees</p>
          <h2 className="mt-2 text-3xl font-bold">39</h2>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Managers</p>
          <h2 className="mt-2 text-3xl font-bold">8</h2>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pending Invites</p>
          <h2 className="mt-2 text-3xl font-bold">1</h2>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCount;
