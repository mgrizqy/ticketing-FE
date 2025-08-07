"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Dashboard from "../components/DashboardLayout";
import { BadgeCheck, BadgeDollarSign, CircleX, FileClock } from "lucide-react";
import TransactionList from "./components/TransactionList";
import { apiCall } from "@/helper/apiCall";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/loadingStore";
import LoadingPage from "@/app/components/LoadingPage";

interface TransactionDetails {
  id: string;
  transaction_status: string;
}

function ManageTransactions() {
  // store data useState
  const [transaction, setTransaction] = useState<TransactionDetails[]>([]);
  // const { isLoading, setLoading } = useLoadingStore();

  // access data from db
  const getData = async () => {
    try {
      // setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiCall.get("/transaction/detail", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transactionDetailsData = res.data.data;

      setTransaction(transactionDetailsData);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const transactionCard = [
    {
      id: 1,
      icon: <BadgeDollarSign></BadgeDollarSign>,
      name: "Transactions",
      content: transaction.length,
    },
    {
      id: 2,
      icon: <FileClock></FileClock>,
      name: "Pending",
      content: transaction.filter((t) => t.transaction_status === "PENDING")
        .length,
    },
    {
      id: 3,
      icon: <BadgeCheck></BadgeCheck>,
      name: "Success",
      content: transaction.filter((t) => t.transaction_status === "PAID")
        .length,
    },
    {
      id: 4,
      icon: <CircleX></CircleX>,
      name: "Rejected",
      content: transaction.filter((t) => t.transaction_status === "REJECTED")
        .length,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      getData(); // fetch ulang tiap 30detik
    }, 5000);
    // getData();
    return () => clearInterval(interval); // cleanup
  }, []);

  // if (isLoading) {
  //   return <LoadingPage></LoadingPage>;
  // }

  return (
    <section>
      <Dashboard>
        {/*  */}
        <div
          id="transaction-card"
          className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4"
        >
          {transactionCard.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <div className="flex gap-x-1 items-center justify-center font-semibold text-center">
                  {e.icon}
                  <p className="text-sm  xl:text-2xl">{e.name}</p>
                </div>
              </CardHeader>
              <CardContent className="text-center text-3xl md:text-4xl xl:text-5xl font-semibold">
                {e.content}
              </CardContent>
            </Card>
          ))}
        </div>
        {/*  */}
        <div className="mt-5">
          <TransactionList />
        </div>
      </Dashboard>
    </section>
  );
}

export default ManageTransactions;
