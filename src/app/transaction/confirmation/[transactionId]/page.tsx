import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { apiCall } from "@/helper/apiCall";
import { PartyPopper, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

async function getTransactionData(transactionId: string) {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const res = await apiCall.get(`/transaction/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ConfirmationPage({
  params,
}: {
  params: { transactionId: string };
}) {
  const transaction = await getTransactionData(params.transactionId);

  if (!transaction) {
    notFound();
  }

  const isDone = transaction.transaction_status === "PAID";
  const isRejected = transaction.transaction_status === "REJECTED";

  const transactionDate = new Date(transaction.created_at).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-blue/10 font-poppins p-4">
      <Card className="w-full max-w-lg p-4 sm:p-6 shadow-lg border-prussian-blue/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit">
            {isDone ? (
              <PartyPopper className="h-16 w-16 text-blue-green" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="mt-4 text-3xl font-bold font-display text-prussian-blue">
            {isDone ? "Payment Confirmed!" : "Transaction Rejected"}
          </CardTitle>
          <CardDescription className="text-prussian-blue/70">
            Status for order{" "}
            <span className="font-semibold font-mono text-prussian-blue">
              {transaction.id.slice(-12).toUpperCase()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-left bg-slate-50 border border-prussian-blue/10 rounded-lg p-4">
            <h3 className="font-semibold text-prussian-blue mb-3">
              Transaction Summary
            </h3>
            <div className="space-y-2 text-sm text-prussian-blue/80">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold">{transactionDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold">Bank Transfer</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-prussian-blue">
                <span>Total Amount:</span>
                <span>
                  {transaction.amount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-prussian-blue/60 pt-2 text-center">
            {isDone
              ? "Your e-tickets have been sent to your email. Enjoy the event!"
              : "Any points or vouchers used have been refunded to your account."}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            asChild
            size="lg"
            className="w-full font-bold bg-ut-orange hover:bg-ut-orange/90"
          >
            <Link href="/">Back to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
