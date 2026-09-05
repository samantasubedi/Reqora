import React from 'react'

export const PendingRequest = () => {
  return (
    <div>    <div className="rounded-xl bg-white p-5 shadow">
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
        </div></div>
  )
}
