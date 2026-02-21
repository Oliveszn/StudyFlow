"use client";

import { useState } from "react";
import { X, ShoppingCart, Lock, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInitializePayment } from "@/hooks/endpoints/usePayments";
import type { Course } from "@/api/endpoints/courses";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course & { lessonCount?: number };
}

export default function PaymentModal({
  isOpen,
  onClose,
  course,
}: PaymentModalProps) {
  const router = useRouter();
  const { mutate: initializePayment, isPending } = useInitializePayment();

  if (!isOpen) return null;

  const finalPrice = Number(course.discountPrice ?? course.price);
  const hasDiscount =
    course.discountPrice && course.discountPrice < course.price;

  const handlePayment = () => {
    initializePayment(course.id, {
      onSuccess: (data) => {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorizationUrl;
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Complete Purchase
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">You're purchasing:</p>
            <h3 className="font-semibold text-gray-900 text-lg leading-snug">
              {course.title}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Original Price</span>
              <span
                className={
                  hasDiscount
                    ? "line-through text-gray-400"
                    : "font-semibold text-gray-900"
                }
              >
                ₦{Number(course.price).toFixed(2)}
              </span>
            </div>

            {hasDiscount && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium">
                    -₦{(course.price - course.discountPrice!).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{finalPrice.toFixed(2)}
                  </span>
                </div>
              </>
            )}

            {!hasDiscount && (
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₦{finalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-0.5">Secure Payment</p>
              <p className="text-blue-700">
                You'll be redirected to Paystack's secure payment page
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handlePayment}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isPending}
              className="w-full py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            30-Day Money-Back Guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
