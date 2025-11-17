"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { CircleAlert, LockOpen } from "lucide-react";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRegister } from "@/hooks/endpoints/useAuth";
import { registerSchema, RegisterSchema } from "@/utils/validationSchema";

const INITIAL_VALUES: RegisterSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const Register = () => {
  const formik = useFormik<RegisterSchema>({
    initialValues: INITIAL_VALUES,
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const { mutate: register, isPending } = useRegister();
  const handleSubmit = async (data: RegisterSchema) => {
    register(data);
  };

  const getFieldError = (field: keyof RegisterSchema) => {
    return formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : null;
  };

  const isSubmitDisabled = isPending || !formik.isValid;
  return (
    <div className="w-full max-w-lg space-y-6 bg-white shadow-lg rounded-xl p-8">
      <div className="flex flex-col items-center gap-2 my-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create an account
        </h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="">
              First Name
            </Label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                className="border-0 focus-visible:ring-0 py-4"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
                aria-invalid={!!getFieldError("firstName")}
                aria-describedby={
                  getFieldError("firstName") ? "firstName-error" : undefined
                }
              />
            </div>

            {getFieldError("firstName") && (
              <p
                id="firstName-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {getFieldError("firstName")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="">
              Last Name
            </Label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <Input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="border-0 focus-visible:ring-0 py-4"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
                aria-invalid={!!getFieldError("lastName")}
                aria-describedby={
                  getFieldError("lastName") ? "lastName-error" : undefined
                }
              />
            </div>

            {getFieldError("lastName") && (
              <p
                id="lastName-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {getFieldError("lastName")}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs flex items-center gap-4 font-medium text-gray-500">
          <CircleAlert className="size-7" />
          Your name should be your legal name, because this will be matched with
          your bank account for payouts.
        </p>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="">
            Email
          </Label>
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border-0 focus-visible:ring-0 py-4"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              aria-invalid={!!getFieldError("email")}
              aria-describedby={
                getFieldError("email") ? "email-error" : undefined
              }
            />
          </div>

          {getFieldError("email") && (
            <p id="email-error" className="text-red-500 text-sm" role="alert">
              {getFieldError("email")}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="">
            Password
          </Label>
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border-0 focus-visible:ring-0 py-4"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
          </div>

          {getFieldError("password") && (
            <p className="text-red-500 text-sm" role="alert">
              {getFieldError("password")}
            </p>
          )}

          <p className="text-xs font-medium text-gray-500">
            Password must include lowercase, uppercase and symbols for maximum
            security.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full text-white transition-colors ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <LockOpen className="size-5" />
              Sign Up
            </div>
          )}
        </Button>
      </form>

      <footer className="text-center text-base text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login instead
        </Link>
      </footer>
    </div>
  );
};

export default Register;
