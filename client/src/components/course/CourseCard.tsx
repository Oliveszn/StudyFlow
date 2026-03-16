"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Heart, Play, ShoppingCart, Star } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/helpers/dateFormatter";
import {
  useAddToWishlist,
  useCheckWishlist,
  useRemoveFromWishlist,
} from "@/hooks/endpoints/student/useWishlist";
import { useRouter } from "next/navigation";
import { useCheckEnrollment } from "@/hooks/endpoints/student/useEnrollments";
import { useState } from "react";
import PaymentModal from "../payment/PaymentModal";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    thumbnail?: string;
    price: number;
    discountPrice?: number | null;
    averageRating?: number | null;
    reviewCount?: number;
    instructor?: Instructor;
    updatedAt: string;
    whatYouWillLearn?: string[];
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const {
    slug,
    title,
    subtitle,
    description,
    thumbnail,
    price,
    discountPrice,
    averageRating,
    reviewCount,
    instructor,
    updatedAt,
    whatYouWillLearn,
  } = course;
  const router = useRouter();
  const { data: wishlistData } = useCheckWishlist(course.id);
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();

  const isWishlisted = wishlistData?.data?.inWishlist ?? false;
  const isLoading = isAdding || isRemoving;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { data: enrollmentData } = useCheckEnrollment(course.id);
  const isEnrolled = enrollmentData?.data?.isEnrolled ?? false;
  const enrollmentId = enrollmentData?.data?.enrollmentId;

  const finalPrice =
    discountPrice && Number(discountPrice) > 0
      ? Number(discountPrice)
      : Number(price);

  const rating = averageRating ?? 1.0;

  const formattedDate = getFormattedDate(updatedAt);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(course.id);
    } else {
      addToWishlist(course.id);
    }
  };
  return (
    <>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link href={`/courses/${slug}`}>
            <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative w-full h-44 bg-gray-100">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>

                {instructor && (
                  <p className="text-xs text-muted-foreground">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium text-yellow-600">
                    {rating.toFixed(1)}
                  </span>
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-muted-foreground text-xs">
                    ({reviewCount ?? 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-bold text-sm">
                    {/* {finalPrice === 0
                    ? "Free"
                    : `₦${finalPrice.toLocaleString()}`} */}
                    {Number(finalPrice) === 0
                      ? "Free"
                      : `₦${Number(finalPrice).toLocaleString()}`}
                  </span>

                  {discountPrice && discountPrice > 0 && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₦{price.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </HoverCardTrigger>

        <HoverCardContent side="right" align="start" className="w-80 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-base">{title}</h3>

            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Updated {formattedDate}
            </p>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          </div>

          {whatYouWillLearn?.length ? (
            <div className="space-y-2">
              <p className="font-medium text-sm">What you'll learn</p>
              <ul className="space-y-1">
                {whatYouWillLearn.slice(0, 3).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="w-4 h-4 mt-0.5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-center gap-2 pt-2">
            <Button
              className="flex-1 bg-main hover:bg-main-foreground"
              onClick={() =>
                isEnrolled
                  ? router.push(`/learn/${enrollmentId}`)
                  : setIsPaymentModalOpen(true)
              }
            >
              {isEnrolled ? (
                <>
                  <Play className="w-5 h-5" />
                  Go to Course
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Enroll Now
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlist}
              disabled={isLoading}
            >
              <Heart
                className="w-4 h-4"
                fill={isWishlisted ? "#ef4444" : "none"}
                color={isWishlisted ? "#ef4444" : "currentColor"}
              />
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
      />
    </>
  );
}
