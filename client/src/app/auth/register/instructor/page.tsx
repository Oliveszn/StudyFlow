"use client";
import { useRegisterInstructor } from "@/hooks/endpoints/useAuth";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormikInput } from "@/components/common/FormikInput";
import { registerSchema, RegisterSchema } from "@/utils/validationSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Form, Formik } from "formik";

const INITIAL_VALUES: RegisterSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function InstructorRegisterPage() {
  const { mutate, isPending } = useRegisterInstructor();

  //  const formik = useFormik<RegisterSchema>({
  //    initialValues: INITIAL_VALUES,
  //    validationSchema: toFormikValidationSchema(registerSchema),
  //    onSubmit: (values) => {
  //      handleSubmit(values);
  //    },
  //  });
  // const handleSubmit = async (data: RegisterSchema) => {
  //   mutate(data);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Become an Instructor</h1>
          <p className="text-gray-500 text-sm">
            Create your instructor account and start teaching
          </p>
        </div>
        <Formik<RegisterSchema>
          initialValues={INITIAL_VALUES}
          validationSchema={toFormikValidationSchema(registerSchema)}
          onSubmit={(values) => mutate(values)}
        >
          <Form className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                {/* <Input placeholder="First name" {...register("firstName")} />*/}
                <FormikInput name="firstName" placeholder="First name" />
              </div>
              <div className="flex-1 space-y-1">
                {/* <Input placeholder="Last name" {...register("lastName")} /> */}
                <FormikInput name="lastName" placeholder="Last name" />
              </div>
            </div>

            <div className="space-y-1">
              {/* <Input type="email" placeholder="Email address" {...register("email")} />*/}
              <FormikInput
                name="email"
                type="email"
                placeholder="Email address"
              />
            </div>

            <div className="space-y-1">
              {/* <Input type="password" placeholder="Password" {...register("password")} /> */}
              <FormikInput
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-main text-white hover:bg-main-foreground"
            >
              {isPending ? "Creating account..." : "Create Instructor Account"}
            </Button>
          </Form>
        </Formik>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-main font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
