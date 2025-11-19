"use client";

import { Provider } from "react-redux";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "@/store/store";
import AuthProvider from "./AuthProvider";
import CheckAuth from "@/components/common/CheckAuth";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 401 errors
              if (error?.response?.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
            staleTime: 30000, // 30 seconds
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <CheckAuth>{children}</CheckAuth>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default Providers;
