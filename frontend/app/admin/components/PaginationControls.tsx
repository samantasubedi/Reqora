import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatePages } from "@/lib/HelperFunctions";

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = calculatePages({ currentPage, totalPages });

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((pageNumber, index) =>
        typeof pageNumber === "number" ? (
          <Button
            key={index}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ) : (
          <span key={index} className="px-1 text-sm text-muted-foreground">
            {pageNumber}
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;