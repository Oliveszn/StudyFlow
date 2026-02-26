"use client";

import { useClearWishlist } from "@/hooks/endpoints/student/useWishlist";
import WishlistCard from "./WishlistCard";
import { Trash2 } from "lucide-react";
import { WishlistItem } from "@/api/endpoints/student/wishlist";

interface Props {
  items: WishlistItem[];
}

export default function WishlistGrid({ items }: Props) {
  const { mutate: clearAll, isPending } = useClearWishlist();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => clearAll()}
          disabled={isPending}
          className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-rose-400 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
