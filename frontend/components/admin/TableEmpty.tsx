import React from "react";
import { Card } from "@/components/ui/card";
import { Plus, FolderOpen } from "lucide-react";

export default function TableEmpty() {
  return (
    <div className="w-full">
      <Card className="border border-dashed border-teal-300 bg-linear-to-br from-teal-50 to-blue-50">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
            <FolderOpen className="w-12 h-12 text-teal-500" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            No resources yet
          </h2>

          <p className="text-gray-600 text-sm max-w-xs mb-8">
            Start building your resource inventory by adding your first resource
            to the dashboard.
          </p>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
            <Plus className="w-5 h-5" />
            Add resource
          </button>
        </div>
      </Card>
    </div>
  );
}
