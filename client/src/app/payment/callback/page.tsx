"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyPayment } from "@/hooks/endpoints/usePayments";
import PaymentProcessing from "@/components/payment/PaymentProcessing";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import PaymentFailed from "@/components/payment/PaymentFailed";

type PaymentStatus = "processing" | "success" | "failed";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [transactionData, setTransactionData] = useState<any>(null);

  const { mutate: verifyPayment } = useVerifyPayment();

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("failed");
      return;
    }

    verifyPayment(reference, {
      onSuccess: (data) => {
        setTransactionData(data.data);
        setStatus("success");
      },
      onError: (error) => {
        setStatus("failed");
      },
    });
  }, [searchParams, verifyPayment]);

  if (status === "processing") {
    return <PaymentProcessing />;
  }

  if (status === "success") {
    return (
      <PaymentSuccess
        transaction={transactionData?.transaction}
        // onContinue={() => router.push("/my-courses")}
        onContinue={() => {
          router.push("/");
        }}
      />
    );
  }

  return (
    <PaymentFailed
      onRetry={() => {
        router.back();
      }}
    />
  );
}
