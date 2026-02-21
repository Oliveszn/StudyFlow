"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSort: string;
}

export default function CategorySort({ currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-end">
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded px-4 py-2"
      >
        <option value="popular">Most Popular</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
