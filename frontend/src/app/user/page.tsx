import type { Metadata } from "next";
import Overview from "../components/user/overview";

export const metadata: Metadata = {
  title: "Overview | TaskTrek",
  description: "View your task statistics and overview",
  metadataBase: new URL("https://yourdomain.com"),
  keywords: ["overview", "dashboard", "tasks", "statistics"],
  authors: [{ name: "TaskTrek" }],
};

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s your task summary and statistics.
          </p>
        </div>
      </div>

      <Overview />
    </div>
  );
}