import { PendingRequest } from "./PendingRequest";
import { RecentActivity } from "./RecentActivity";
import ResourceCards from "./ResourceCards";

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's an overview of your resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />
          <div>
            <p className="font-medium">John Manager</p>
            <p className="text-sm text-gray-500">Manager</p>
          </div>
        </div>
      </div>

      <ResourceCards />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Resource Distribution</h2>
          </div>

          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            Pie Chart Placeholder
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Resource Usage Trend</h2>
          </div>

          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            Area Chart Placeholder
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <PendingRequest />

        <RecentActivity />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 font-semibold">
            Department Resource Distribution
          </h2>

          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            Bar Chart Placeholder
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 font-semibold">Maintenance Alerts</h2>

          <div className="space-y-3">
            {[
              "Laptop #7 - Battery Failure",
              "Vehicle #2 - Service Overdue",
              "Printer #3 - Ink Replacement",
              "Server #1 - Cooling Issue",
            ].map((alert, index) => (
              <div
                key={index}
                className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3"
              >
                <p className="font-medium">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 font-semibold">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-lg border p-4 transition hover:bg-gray-50">
            Add Resource
          </button>

          <button className="rounded-lg border p-4 transition hover:bg-gray-50">
            Manage Employees
          </button>

          <button className="rounded-lg border p-4 transition hover:bg-gray-50">
            View Reports
          </button>

          <button className="rounded-lg border p-4 transition hover:bg-gray-50">
            Resource Requests
          </button>
        </div>
      </div>
    </div>
  );
}
