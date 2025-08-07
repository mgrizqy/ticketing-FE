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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditSeats from "./core-comps/EditSeats";
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";

interface ISeatsProps {
  id: string;
  name: string;
  total_seat: number;
  booked_seat: number;
}

function SeatList() {
  // seats detail
  const [seats, setSeats] = useState<ISeatsProps[]>([]);

  // open edit seats
  const [editSeats, setEditSeats] = useState(false);

  // const edit seats counts
  const [editSelectedSeats, setEditSelectedSeats] =
    useState<ISeatsProps | null>(null);

  // handler edit
  const handlerEditSeats = (seatsData: ISeatsProps) => {
    setEditSelectedSeats(seatsData);
    setEditSeats(true);
  };

  // get Data from db
  const getSeatsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await apiCall.get("/events/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventData = res.data.data;
      setSeats(eventData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSeatsData();
  }, []);

  return (
    <section>
      <Card className=" w-full overflow-auto mt-2 lg:mt-15 h-75">
        <CardHeader className="text-center mt-2">
          <CardTitle>Seat Management</CardTitle>
          <CardDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. A, magni.
          </CardDescription>
          {/* <Button onClick={getSeatsData}>Testing</Button> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Event Name</TableHead>
                <TableHead className="text-center">Total Seats</TableHead>
                <TableHead className="text-center">Available Seats</TableHead>
                <TableHead className="text-center">Booked</TableHead>
                <TableHead className="text-center">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seats.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="text-center">{data.name}</TableCell>
                  <TableCell className="text-center">
                    {data.total_seat}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.total_seat - data.booked_seat}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.booked_seat}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button onClick={() => handlerEditSeats(data)}>
                      Edit Seats
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* // Seats */}
      <EditSeats
        open={editSeats}
        onOpenChange={setEditSeats}
        seats={editSelectedSeats}
      />
    </section>
  );
}

export default SeatList;
