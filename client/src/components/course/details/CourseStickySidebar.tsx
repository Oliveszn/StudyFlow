"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Play,
  ShoppingCart,
  Heart,
  Share2,
  Clock,
  BookOpen,
  Award,
  Infinity,
} from "lucide-react";
import type { Course } from "@/api/endpoints/courses";
import PaymentModal from "@/components/payment/PaymentModal";
import { Button } from "@/components/ui/button";

interface CourseStickySidebarProps {
  course: Course & { lessonCount: number };
}

const SidebarFeature = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

export default function CourseStickySidebar({
  course,
}: CourseStickySidebarProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const finalPrice = Number(course.discountPrice ?? course.price);
  const hasDiscount =
    course.discountPrice && course.discountPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  return (
    <>
      <div className="lg:sticky lg:top-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full h-52 bg-gray-100 group cursor-pointer">
            <Image
              src={course.thumbnail || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <Play
                  className="w-6 h-6 text-gray-900 ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-white text-sm font-medium drop-shadow">
                Preview this course
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₦{finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    ₦{Number(course.price).toFixed(2)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-sm font-semibold text-red-600">
                    {discountPercent}% off
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  🔥 Limited time offer
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-3 bg-main text-white font-semibold rounded-lg hover:bg-main-foreground transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Enroll Now
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              30-Day Money-Back Guarantee
            </p>

            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <p className="text-sm font-semibold text-gray-900">
                This course includes:
              </p>
              {/* <SidebarFeature
              icon={Clock}
              text={`${Math.round((course.totalDuration || 0) / 3600)} hours on-demand video`}
            /> */}
              <SidebarFeature
                icon={BookOpen}
                text={`${course.lessonCount} lessons`}
              />
              <SidebarFeature icon={Infinity} text="Full lifetime access" />
              <SidebarFeature icon={Award} text="Certificate of completion" />
            </div>

            <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition"
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? "#ef4444" : "none"}
                  color={isWishlisted ? "#ef4444" : "currentColor"}
                />
                Wishlist
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
      />
    </>
  );
}
