import type { Metadata } from "next";
import UserDashboard from "../components/user/user-dashboard";

export const metadata: Metadata = {
  title: "Overview | TaskTrek",
  description: "View your task statistics and overview",
};

export default function UserPage() {
  return <UserDashboard />;
}