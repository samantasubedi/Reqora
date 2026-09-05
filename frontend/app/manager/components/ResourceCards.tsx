import React from "react";

const ResourceCards = () => {
  return (
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
  );
};

export default ResourceCards;
