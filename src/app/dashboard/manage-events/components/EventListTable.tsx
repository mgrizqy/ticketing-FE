"use client";
import { eventData } from "@/app/components/EventListSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { useEffect, useState } from "react";

interface IEventList {
  id: string;
  name: string;
  price: number;
  start_date: string;
  end_date: string;
  category: string;
  address: string;
  city: string;
  promo_code: string;
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // kalau tanggal invalid
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function EventListTable() {
  // store data
  const [events, setEvents] = useState<IEventList[]>([]);

  // get data from db
  const getEventsbyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await apiCall.get("/events/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventData = res.data.data;
      console.log(eventData);
      setEvents(eventData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEventsbyAttendance();
  }, []);

  return (
    <Card className="p-6 w-full overflow-auto mt-3 h-80">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. A, magni.
        </CardDescription>
        {/* <Button onClick={getEventsbyAttendance}>testing data</Button> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Event Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Location</TableHead>
              <TableHead className="text-center">Price per Event</TableHead>
              <TableHead className="text-center">Promo Code</TableHead>
              <TableHead className="text-center">Edit Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="text-center">{data.name}</TableCell>
                <TableCell className="text-center">
                  {data.start_date
                    ? data.end_date
                      ? `${formatDate(data.start_date)} - ${formatDate(
                          data.end_date
                        )}`
                      : formatDate(data.start_date)
                    : "-"}
                </TableCell>
                <TableCell className="text-center">{data.category}</TableCell>
                <TableCell className="text-center">{data.address}</TableCell>
                <TableCell className="text-center">Rp. {data.price}</TableCell>
                <TableCell className="text-center">{data.promo_code}</TableCell>
                <TableCell className="text-center">
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default EventListTable;
