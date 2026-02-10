import { AxiosError } from "axios";

export const handleApiError = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "response" in error) {
    // @ts-ignore
    return error.response?.data?.message || "Something went wrong";
  }
  return "Network error. Please try again.";
};
