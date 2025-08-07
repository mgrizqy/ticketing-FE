"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PartyPopper, XCircle } from "lucide-react";
import Link from "next/link";

// Define only the final statuses this page will handle
type FinalStatus = "DONE" | "REJECTED";

// --- MOCK DATA ---
const mockConfirmation = {
  orderNumber: "TRX-2025-ABCD-1234",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  paymentMethod: "Bank Transfer",
  totalAmount: 430000,
};
// --- END MOCK DATA ---

export default function StaticConfirmationPage() {
  // Use state to toggle between the two final states for testing
  const [status, setStatus] = useState<FinalStatus>("DONE");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-blue/10 font-poppins p-4">
      <Card className="w-full max-w-lg p-4 sm:p-6 shadow-lg border-prussian-blue/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit">
            {/* --- TERNARY OPERATOR FOR ICON --- */}
            {status === "DONE" ? (
              <PartyPopper className="h-16 w-16 text-blue-green" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="mt-4 text-3xl font-bold font-display text-prussian-blue">
            {/* --- TERNARY OPERATOR FOR TITLE --- */}
            {status === "DONE" ? "Payment Confirmed!" : "Transaction Rejected"}
          </CardTitle>
          <CardDescription className="text-prussian-blue/70">
            Status for order{" "}
            <span className="font-semibold font-mono text-prussian-blue">
              {mockConfirmation.orderNumber}
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
                <span className="font-semibold">{mockConfirmation.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold">
                  {mockConfirmation.paymentMethod}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-prussian-blue">
                <span>Total Amount:</span>
                <span>
                  {mockConfirmation.totalAmount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-prussian-blue/60 pt-2 text-center">
            {/* --- TERNARY OPERATOR FOR DETAILS TEXT --- */}
            {status === "DONE"
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

      {/* --- DEV ONLY: State Toggler Buttons --- */}
      <div className="mt-8 p-4 border-2 border-dashed rounded-lg bg-white">
        <p className="text-sm font-semibold text-center mb-2">
          DEV: Simulate Final Status
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStatus("DONE")}>
            Confirmed
          </Button>
          <Button variant="outline" onClick={() => setStatus("REJECTED")}>
            Rejected
          </Button>
        </div>
      </div>
    </div>
  );
}
