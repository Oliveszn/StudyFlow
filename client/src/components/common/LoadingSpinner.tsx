export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full size-12 border-4 border-t-black/80 border-r-black/80 border-b-black/80 border-l-transparent" />
    </div>
  );
}
