import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface IAttendanceDetail {
  invoice: string;
  customerName: string;
  quantity: number;
}

interface IEventsByOrganizerProps {
  id: string;
  name: string;
  attendanceDetails: IAttendanceDetail[];
}

interface AttendanceDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: IEventsByOrganizerProps | null;
}

function AttendanceDetails({
  open,
  onOpenChange,
  selectedEvent,
}: AttendanceDetailsProps) {
  useEffect;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-6xl">
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Doloremque, voluptas!
          </DialogDescription>
        </DialogHeader>

        {/* Table */}
        <div className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Code</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Quantity</TableHead>
                {/* <TableHead>Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedEvent?.attendanceDetails?.length ? (
                selectedEvent.attendanceDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.invoice}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AttendanceDetails;
