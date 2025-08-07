"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Settings, Check, X, Send } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/authStore";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DevTransactionSimulator() {
  const [transactionId, setTransactionId] = useState("");
  const [lastUpdatedId, setLastUpdatedId] = useState("");
  const { token } = useAuthStore();
  const router = useRouter();

  const handleAction = async (status: "approve" | "reject") => {
    if (!transactionId) {
      return toast.error("Please enter a Transaction Detail ID.");
    }
    if (!token) {
      return toast.error("You must be logged in to perform this action.");
    }

    try {
      // These are the mock backend endpoints you would create
      const endpoint = `/transactions/${status}/${transactionId}`;
      const res = await apiCall.patch(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Transaction successfully set to: ${status.toUpperCase()}`);
      setLastUpdatedId(transactionId); // Save the ID to enable the "View" button
    } catch (error: any) {
      toast.error("Action failed");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-white shadow-lg"
        >
          <Settings className="h-6 w-6 " />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Dev: Transaction Simulator</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <div>
              <Label htmlFor="txn-id" className="text-prussian-blue/80">
                Transaction Detail ID
              </Label>
              <Input
                id="txn-id"
                placeholder="Enter transaction UUID..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleAction("approve")}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleAction("reject")}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>

            {lastUpdatedId && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() =>
                    router.push(`/transaction/confirmation/${lastUpdatedId}`)
                  }
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" /> View Confirmation Page for #
                  {lastUpdatedId.slice(0, 8)}...
                </Button>
              </div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
