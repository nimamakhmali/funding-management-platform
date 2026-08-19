import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectsPagination() {
  return (
    <div className="mt-12">
      <Pagination>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationLink
              href="#"
              className="
                h-10 w-10 rounded-xl border border-border
                hover:border-primary hover:text-primary
              "
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="
                h-10 w-10 rounded-xl
                bg-primary text-white
                border-primary
                hover:bg-primary-dark
              "
            >
              ۱
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              className="
                h-10 w-10 rounded-xl border border-border
                hover:border-primary hover:text-primary
              "
            >
              ۲
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              className="
                h-10 w-10 rounded-xl border border-border
                hover:border-primary hover:text-primary
              "
            >
              ۳
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              className="
                h-10 w-10 rounded-xl border border-border
                hover:border-primary hover:text-primary
              "
            >
              ۸
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="
                h-10 w-10 rounded-xl border border-border
                hover:border-primary hover:text-primary
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
