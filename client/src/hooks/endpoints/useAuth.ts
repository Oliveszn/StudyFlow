import { authApi } from "@/api/endpoints/auth";
import { clearAuth, setAuth } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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

      if (data.success && data.data.user) {
        dispatch(
          setAuth({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        queryClient.invalidateQueries({ queryKey: ["authstatus"] });

        router.push("/dashboard");
      }
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

      if (data.success && data.data.user) {
        dispatch(
          setAuth({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        queryClient.invalidateQueries({ queryKey: ["authstatus"] });

        router.push("/dashboard");
      }
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }

      router.push("/");
    },

    onError: (error: unknown) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

export const useCheckAuth = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["authstatus"],
    queryFn: async () => {
      try {
        const data = await authApi.checkAuthStatus();

        if (data.user) {
          dispatch(
            setAuth({
              user: data.user,
            })
          );
        } else {
          dispatch(clearAuth());
        }

        return data;
      } catch (error: any) {
        dispatch(clearAuth());

        return {
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        };
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRefreshToken = () => {};

export const useAuthState = () => {
  const auth = useAppSelector((state) => state.auth);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    error: auth.error,
    status: auth.status,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  };
};
