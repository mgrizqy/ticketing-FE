"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { UploadCloud, Clock, Info, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

// --- MOCK DATA ---
const mockTransaction = {
  eventName: "Indie Rock Night ft. The Wandering Souls",
  totalPrice: 430000,
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
};
// --- END MOCK DATA ---

export default function StaticPaymentPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "done"
  >("idle");

  // Countdown Timer Logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const difference = mockTransaction.expiresAt.getTime() - now;
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeLeft("Expired");
        clearInterval(timerInterval);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!paymentProofFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    setSubmitState("submitting");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitState("done");
    toast.success("Payment proof submitted!", {
      description:
        "You will be notified once the organizer confirms your payment.",
    });

    setTimeout(() => {
      router.push("/");
    }, 3000); // Increased delay slightly to let user read the message
  };

  const buttonText = () => {
    switch (submitState) {
      case "submitting":
        return "Submitting...";
      case "done":
        return "Submitted Successfully";
      default:
        return "I Have Paid, Submit Proof";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-blue/10 font-poppins p-4">
      <Card className="w-full max-w-md shadow-lg border-prussian-blue/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-prussian-blue">
            Complete Your Payment
          </CardTitle>
          <CardDescription className="text-center text-prussian-blue/70">
            For:{" "}
            <span className="font-semibold">{mockTransaction.eventName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <div className="w-full text-center p-4 border-2 border-blue-green rounded-lg bg-blue-green/5">
            <p className="font-semibold text-prussian-blue">
              Total Amount Due:
            </p>
            <p className="text-3xl font-bold text-blue-green">
              {mockTransaction.totalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="w-full text-center p-3 rounded-lg bg-ut-orange/10 text-ut-orange border border-ut-orange/50">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Clock className="h-5 w-5" />
              <span>Time Remaining</span>
            </div>
            <p className="font-mono text-xl tracking-wider mt-1">{timeLeft}</p>
          </div>

          <div className="w-full space-y-2">
            <label
              htmlFor="payment-proof"
              className="font-semibold text-prussian-blue"
            >
              Upload Your Receipt
            </label>
            <label
              htmlFor="payment-proof"
              className="relative block border-2 border-dashed border-prussian-blue/20 rounded-lg p-6 text-center hover:border-blue-green transition-colors cursor-pointer"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-prussian-blue/30" />
              <p className="mt-2 text-sm text-prussian-blue/60">
                {paymentProofFile
                  ? paymentProofFile.name
                  : "Click or drag file to upload"}
              </p>
              <Input
                id="payment-proof"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full font-bold bg-ut-orange hover:bg-ut-orange/90"
            onClick={handleSubmit}
            disabled={submitState !== "idle" || timeLeft === "Expired"}
          >
            {buttonText()}
          </Button>
        </CardFooter>
      </Card>

      {/* --- THIS IS THE NEW PART --- */}
      <div
        className={`mt-4 text-center transition-opacity duration-300 ${
          submitState === "done" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-prussian-blue/80">
          <CheckCircle className="h-5 w-5 text-blue-green" />
          <p className="font-semibold">
            Awaiting organizer confirmation. Redirecting...
          </p>
        </div>
      </div>
      {/* --- END NEW PART --- */}
    </div>
  );
}
