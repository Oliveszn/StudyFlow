import { authApi } from "@/api/endpoints/auth";
import { useAppDispatch } from "@/store/hooks";
import { handleApiError } from "@/utils/apiError";
import { LoginSchema, RegisterSchema } from "@/utils/validationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (form: RegisterSchema) => authApi.registerUser(form),

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["authstatus"] });

      router.push("/dashboard");
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (form: LoginSchema) => authApi.loginUser(form),

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["authstatus"] });

      router.push("/dashboard");
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logoutUser(),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.clear(); // or specifically remove your auth flag
      }

      router.push("/");
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};
