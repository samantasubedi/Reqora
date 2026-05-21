import React from "react";
import { Card } from "@/components/ui/card";
import { Plus, FolderOpen } from "lucide-react";
import { Icon } from "@iconify/react";

export default function TableEmpty() {
  return (
    <div className="w-full">
      <Card className="border border-dashed border-teal-300 bg-linear-to-br from-teal-50 to-blue-50">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
         <Icon icon="material-symbols:folder-open-rounded" className="size-12 text-teal-800"/>
          </div>

          <h2 className="text-2xl font-semibold text-red-900 mb-3">
            No resources yet
          </h2>

          <p className="text-gray-600 text-sm max-w-xs mb-8">
            Start building your resource inventory by adding your first resource
            to the dashboard.
          </p>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
      <Icon icon="ic:baseline-plus" className="size-5"></Icon>
            Add resource
          </button>
        </div>
      </Card>
    </div>
  );
}
