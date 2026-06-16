import React from "react";

export const RecentActivity = () => {
  return (
    <div>
      {" "}
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
  );
};
