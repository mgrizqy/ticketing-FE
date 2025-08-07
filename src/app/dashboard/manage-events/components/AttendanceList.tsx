"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import AttendanceDetails from "./core-comps/AttendanceDetails";
import { apiCall } from "@/helper/apiCall";

interface IAttendanceDetail {
  invoice: string;
  customerName: string;
  quantity: number;
}

interface IEventsByOrganizerProps {
  id: string;
  name: string;
  confirmed_attendance_length: number;
  attendanceDetails?: IAttendanceDetail[]; // opsional
}

function AttendanceList() {
  // open details
  const [checkAttendance, setCheckAttendance] = useState(false);

  // get event by organizer
  const [events, setEvents] = useState<IEventsByOrganizerProps[]>([]);
  // selected event
  const [selectedEvents, setSelectedEvents] =
    useState<IEventsByOrganizerProps | null>(null);

  // open details handler
  const handlerOpenAttendance = (attendanceData: IEventsByOrganizerProps) => {
    setSelectedEvents(attendanceData);
    setCheckAttendance(true);
  };

  // get data from db
  const getEventsbyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await apiCall.get("/events/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.data);
      setEvents(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEventsbyAttendance();
  }, []);

  return (
    <section>
      <Card className="p-6 w-full overflow-auto mt-2 lg:mt-15 h-75 ">
        <CardHeader className="text-center">
          <CardTitle>Attendance Management</CardTitle>

          <CardDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. A, magni.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Event Name</TableHead>
                <TableHead className="text-center">Total Confirmed</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {events.map((data) => (
                <TableRow key={data.id} className="">
                  <TableCell className="text-center">{data.name}</TableCell>
                  <TableCell className="text-center">
                    {data.confirmed_attendance_length}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button onClick={() => handlerOpenAttendance(data)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Attendance Details Trigger */}
      <AttendanceDetails
        open={checkAttendance}
        onOpenChange={setCheckAttendance}
        selectedEvent={selectedEvents}
      />{" "}
    </section>
  );
}

export default AttendanceList;
