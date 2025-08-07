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
import { useEffect, useState } from "react";
import CheckPayment from "./CheckPaymentDialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import ViewDetails from "./ViewDetails";
import { apiCall } from "@/helper/apiCall";
import { useLoadingStore } from "@/store/loadingStore";
import { toast } from "react-toastify";

interface TransactionDetails {
  id: string;
  proof: string;
  quantity: number;
  amount: number;
  isConfirmed: boolean;
  paid_at: Date;
  transaction_status: string;
  detail_event: {
    name: string;
    start_date: string;
    end_date: string | null;
    location_Event: {
      city: string;
      address: string;
    };
    category_event: {
      name: string;
    };
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar: string;
  };
  ticketType: {
    price: number;
  };
}

function TransactionList() {
  // open dialog transaction
  const [openDialog, setOpenDialog] = useState(false);
  //   open details handler
  const [openDetails, setOpenDetails] = useState(false);
  // transaction state
  const [transaction, setTransaction] = useState<TransactionDetails[]>([]);
  // selected view transaction
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetails | null>(null);
  // sort order by latest/oldest
  const [sortOrder, setSortOrder] = useState("latest-first");
  // sort order by status
  const [statusFilter, setStatusFilter] = useState("ALL");

  // get Data Transaction from DB
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiCall.get("/transaction/detail", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactionDetailsData = res.data.data;
      console.log(transactionDetailsData);
      // sort data
      // const filtered = sortTransactions(transactionDetailsData, sortOrder);

      // const filtered = filterTransactionsByStatus(
      //   transactionDetailsData,
      //   statusFilter
      // );
      // const sorted = sortTransactions(filtered, sortOrder);

      // setTransaction(transactionDetailsData);
      setTransaction(transactionDetailsData);
    } catch (error) {
      console.log(error);
    }
  };
  // open dialog handler
  const handlerOpenDialog = (transactionData: TransactionDetails) => {
    setSelectedTransaction(transactionData);
    setOpenDialog(true);
  };
  //   open details handler
  const detailsHandler = (transactionData: TransactionDetails) => {
    // console.log(transactionData);
    setSelectedTransaction(transactionData);
    setOpenDetails(true);
  };
  // delete transaction
  const deleteSelected = async (id: string) => {
    // console.log(id);
    const confirmation = confirm("Are you sure delete this data?");
    if (!confirmation) return;

    const token = localStorage.getItem("token");
    try {
      const res = await apiCall.delete(`/transaction/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setTransaction((prev) => prev.filter((trx) => trx.id !== id));
      toast.success("Delete Data Success");
    } catch (error) {
      console.log(error);
      toast.error("Something Wrong");
    }
  };
  // sorting function by latest/oldest
  const sortTransactions = (data: TransactionDetails[], order: string) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.paid_at).getTime();
      const dateB = new Date(b.paid_at).getTime();

      if (order === "latest-first") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };
  // sorting by status
  const filterTransactionsByStatus = (
    data: TransactionDetails[],
    status: string
  ) => {
    if (status === "ALL") return data;
    return data.filter(
      (trx) => trx.transaction_status.toLowerCase() === status.toLowerCase()
    );
  };

  // payment status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData(); // fetch ulang tiap 30detik
    }, 5000);
    // getData();
    return () => clearInterval(interval); // cleanup
  }, []);

  // sorting useEffect
  return (
    <section>
      <Card className="p-6 w-full">
        {/* <Button onClick={getData}>Testing Data</Button> */}
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs md:text-lg xl:text-xl">
              Transaction Lists
            </CardTitle>
            <CardDescription className="text-xs md:text-md xl:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </div>
          <div className="flex gap-x-2">
            {/* Filter Latest-Oldest */}

            <Select
              onValueChange={(value) => {
                setSortOrder(value);
                setTransaction((prev) => sortTransactions(prev, value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest-first">Latest</SelectItem>
                <SelectItem value="oldest-first">Oldest</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Status */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Customer Name</TableHead>
                <TableHead className="text-center">Event</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Payment Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Check Payment</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.length > 0 ? (
                transaction.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell className="text-center">
                      {data.user.first_name} {data.user.last_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.detail_event.name}
                    </TableCell>
                    <TableCell className="text-center">
                      Rp. {data.ticketType.price * data.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.paid_at
                        ? new Date(data.paid_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={getStatusColor(data.transaction_status)}
                      >
                        {data.transaction_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="cursor-pointer"
                        onClick={() => handlerOpenDialog(data)}
                      >
                        Review Payment
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                        onClick={() => detailsHandler(data)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="cursor-pointer"
                        onClick={() => deleteSelected(data.id)}
                      >
                        <Trash2></Trash2>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {/* masukkan pagination disini */}
      </Card>

      {/* review payment dialog */}
      <CheckPayment
        open={openDialog}
        onOpenChange={setOpenDialog}
        transaction={selectedTransaction}
      />
      {/* view details dialog */}
      <ViewDetails
        open={openDetails}
        onOpenChange={setOpenDetails}
        transaction={selectedTransaction}
      />
    </section>
  );
}

export default TransactionList;
