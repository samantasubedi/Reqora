import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { PaginationControls } from "./PaginationControls";

export const TablePaginationFooter = ({
  currentPage,
  totalPages,
  onPageChange,
  colSpan,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colSpan: number;
}) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={colSpan}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default TablePaginationFooter;