"use client";

import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";

interface PaymentFailedProps {
  onRetry: () => void;
}

export default function PaymentFailed({ onRetry }: PaymentFailedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. This could be due to insufficient
          funds, network issues, or payment cancellation.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-amber-900 font-medium mb-2">
            What you can do:
          </p>
          <ul className="space-y-1.5 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Check your card details and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Try a different payment method</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Contact your bank if the issue persists</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          <button
            onClick={() => (window.location.href = "/courses")}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help?{" "}
          <a href="/support" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
