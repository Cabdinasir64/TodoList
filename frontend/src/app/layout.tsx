import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./providers/query-provider";

export const metadata: Metadata = {
  title: "TaskTrek - Organize and Manage Your Tasks Efficiently",
  description: "TaskTrek helps you organize, prioritize, and complete your tasks efficiently.",
  icons: {
    icon: "/TaskTrek.ico",
    shortcut: "/TaskTrek.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/TaskTrek.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
