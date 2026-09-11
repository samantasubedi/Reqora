import { Icon } from "@iconify/react";

export default function TableEmpty({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 p-4 bg-foreground rounded-full shadow-sm">
            <Icon
              icon="material-symbols:folder-open-rounded"
              className="size-12 text-teal-800"
            />
          </div>

          <h2 className="text-2xl font-semibold text-primary mb-3">
            No resources found !
          </h2>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm bg-secondary">
            <Icon
              icon="ic:baseline-plus"
              className="size-5 cursor-pointer"
            ></Icon>
            Add resource
          </button>
        </div>
      </td>
    </tr>
  );
}
