import { format } from "date-fns";

export const getFormattedDate = (date?: string) => {
  if (!date) return "Recently updated";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "Recently updated";

  return format(parsed, "MMMM yyyy");
};
