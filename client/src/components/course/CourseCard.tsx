"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Heart, Star } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/helpers/dateFormatter";

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

  const finalPrice = discountPrice ?? price;

  const rating = averageRating ?? 1.0;

  const formattedDate = getFormattedDate(updatedAt);
  return (
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
                <span className="font-bold text-sm">₦{finalPrice}</span>

                {discountPrice && (
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
          <Button className="flex-1 bg-main hover:bg-main-foreground">
            Enroll Now
          </Button>

          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
