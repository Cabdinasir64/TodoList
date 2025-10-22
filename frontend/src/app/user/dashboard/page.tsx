import type { Metadata } from "next";
import UserDashboard from "../../components/user/overview/user-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | TaskTrek",
  description: "View your task statistics and overview",
};

export default function UserPage() {
  return <UserDashboard />;
}