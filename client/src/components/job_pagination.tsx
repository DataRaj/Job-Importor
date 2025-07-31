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
          <PaginationPrevious href="#" onClick={onPrevJobPage} />
        </PaginationItem>
        {Array.from({ length: numberOfPages }, (_, index) => (
          <PaginationItem key={index} className={activePage === index + 1 ? `active bg-white` : ''}>
            <PaginationLink href="#" onClick={() => onPageChange(index + 1)}>{index + 1}</PaginationLink>
          </PaginationItem>
        ))}
        {activePage > 1 && (
          <PaginationItem>
            <PaginationLink href="#">{activePage}</PaginationLink>
          </PaginationItem>
        )}
        {activePage < numberOfPages && (
          <PaginationItem>
            <PaginationLink href="#">{activePage + 1}</PaginationLink>
          </PaginationItem>
        )
        }
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
