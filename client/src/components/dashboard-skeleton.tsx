import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export function DashboardSkeleton() {
  return (
    <>
      <TableCell id="title" className="font-medium ">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell id="title" className="font-medium">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
    </>
  );
}
