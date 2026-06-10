import React from 'react'

export const EmployeeTable = () => {
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
    </div>
  )
}
