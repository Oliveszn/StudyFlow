"use client";

import { useField } from "formik";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  type?: string;
  placeholder?: string;
}

export function FormikInput({ name, type = "text", ...props }: Props) {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-1">
      <Input type={type} {...field} {...props} />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs">{meta.error}</p>
      )}
    </div>
  );
}
