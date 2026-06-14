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

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total Resources</p>
          <h2 className="mt-2 text-3xl font-bold">245</h2>
          <p className="mt-2 text-sm text-green-600">+12 this month</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Available</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">180</h2>
          <p className="mt-2 text-sm text-gray-500">Ready for allocation</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Allocated</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">52</h2>
          <p className="mt-2 text-sm text-gray-500">Currently in use</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Maintenance</p>
          <h2 className="mt-2 text-3xl font-bold text-red-500">13</h2>
          <p className="mt-2 text-sm text-gray-500">Need attention</p>
        </div>
      </div>

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
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Pending Requests</h2>

            <button className="text-sm font-medium text-blue-600">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                employee: "Ram Sharma",
                resource: "Laptop #12",
              },
              {
                employee: "Hari KC",
                resource: "Projector #3",
              },
              {
                employee: "Sita Thapa",
                resource: "Vehicle #2",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{item.employee}</p>
                  <p className="text-sm text-gray-500">{item.resource}</p>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-md bg-green-500 px-3 py-1 text-sm text-white">
                    Approve
                  </button>

                  <button className="rounded-md bg-red-500 px-3 py-1 text-sm text-white">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>

          <div className="space-y-4">
            {[
              "Ram requested Laptop #12",
              "Laptop #5 returned",
              "Projector #2 assigned to IT Department",
              "Vehicle #1 marked under maintenance",
              "New employee added",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex gap-3 border-l-2 border-blue-500 pl-4"
              >
                <div>
                  <p>{activity}</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
