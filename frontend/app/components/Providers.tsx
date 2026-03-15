"use client";

import { Connect } from "@stacks/connect-react";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

const APP_DETAILS = {
  name: "Stacks Academy",
  icon: "/favicon.ico",
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Connect authOptions={{ appDetails: APP_DETAILS }}>
      <AuthProvider>{children}</AuthProvider>
    </Connect>
  );
}
