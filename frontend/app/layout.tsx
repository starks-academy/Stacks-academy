import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stacks Academy",
  description: "Learn to Build on Bitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased text-white bg-[#0A0B1A] min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}