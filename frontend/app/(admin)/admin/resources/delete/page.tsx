"use client";
import React, { useState } from "react";
const DeleteResourcePage = () => {
  const [resourceId, setResourceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resourceId.trim()) {
      setMessage("Please enter a valid Resource ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await new Promise((res) => setTimeout(res, 1200));

      setMessage(`Resource with ID "${resourceId}" deleted successfully.`);
      setResourceId("");
    } catch (error) {
      setMessage("Failed to delete resource. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Delete Resource</h1>
          <p className="text-sm text-gray-500 mt-1">
            Permanently remove a resource from Reqora. This action cannot be
            undone.
          </p>
        </div>

        {/* Warning Box */}
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 font-medium">
            Warning: Deleting a resource is irreversible.
          </p>
        </div>

        <form onSubmit={handleDelete} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Resource ID
            </label>
            <input
              type="text"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              placeholder="Enter resource ID to delete"
              className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Resource"}
            </button>

            <button
              type="button"
              onClick={() => {
                setResourceId("");
                setMessage("");
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-5 text-sm text-center text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteResourcePage;
