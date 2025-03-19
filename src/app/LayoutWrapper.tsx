"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { CodeModalWrapper } from "@/app/lib/components/CodeModal/CodeModalWrapper";
import { CodeModalContextProvider } from "@/app/lib/components/CodeModal/CodeModalContext";

const queryClient = new QueryClient();

function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/debug/clear-storage") {
      return;
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <CodeModalContextProvider>
            <CodeModalWrapper>{children}</CodeModalWrapper>
          </CodeModalContextProvider>
        </QueryClientProvider>
      </Suspense>
    </>
  );
}

export { LayoutWrapper };
