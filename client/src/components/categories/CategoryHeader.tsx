interface Props {
  loading: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
    courseCount: number;
  };
}

export default function CategoryHeader({ loading, category }: Props) {
  if (loading) {
    return <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />;
  }

  if (!category) return null;

  return (
    <div className="">
      <h1 className="text-3xl font-semibold">{category.name}</h1>
      <p className="text-gray-500 mt-2">
        {category.courseCount} courses available
      </p>
    </div>
  );
}
