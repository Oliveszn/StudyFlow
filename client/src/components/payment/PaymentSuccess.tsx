"use client";

import { CheckCircle2, Award, BookOpen, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Transaction } from "@/api/endpoints/payments";

interface PaymentSuccessProps {
  transaction?: Transaction;
  onContinue: () => void;
}

export default function PaymentSuccess({
  transaction,
  onContinue,
}: PaymentSuccessProps) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            You're now enrolled in the course
          </p>
        </div>

        {transaction && (
          <div className="bg-blue-50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Course Purchased
                </p>
                <p className="text-gray-900 font-semibold leading-snug">
                  {transaction.courseName}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span>Amount: ${transaction.amount}</span>
                  <span>•</span>
                  <span className="uppercase">{transaction.currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Lifetime access to course materials</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Award className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Certificate of completion</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <BookOpen className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Start learning immediately</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          A receipt has been sent to your email
        </p>
      </div>
    </div>
  );
}
