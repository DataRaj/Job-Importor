import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationDemo({numberOfPages, activePage, onPageChange, onPrevJobPage, onNextJobPage}: {numberOfPages: number, activePage: number, onPageChange: (page: number) => void, onPrevJobPage: () => void, onNextJobPage: () => void}) {
  return (
    <Pagination className="mt-4 bg-gray-100 dark:bg-gray-800 text-gray-950 font-medium">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPrevJobPage();
            }}
          />
          {...Array.from({ length: numberOfPages }, (_, index) => (
            <PaginationItem key={index} className={activePage === index + 1 ? `active bg-white` : ''}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                onPageChange(index + 1);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {numberOfPages > 5 && activePage < numberOfPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
          </PaginationItem>
        
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={onNextJobPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
