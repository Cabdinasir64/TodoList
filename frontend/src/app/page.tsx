import Hero from './components/page/hero'
import Navbar from './components/page/navbar'
import OpenInSafariNotice from './components/common/OpenInSafariNotice'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskTrek - Your Ultimate Task Management App",
  description:
    "TaskTrek helps you organize, prioritize, and complete your tasks efficiently. Boost your productivity with our modern task management tools.",
  keywords: [
    "task management",
    "todolist",
    "productivity app",
    "task tracker",
    "organize tasks",
    "TaskTrek"
  ],
  openGraph: {
    title: "TaskTrek - Your Ultimate Task Management App",
    description:
      "TaskTrek helps you organize, prioritize, and complete your tasks efficiently. Boost your productivity with our modern task management tools.",
    url: "https://todo-list-ten-nu-62.vercel.app",
    siteName: "TaskTrek",
    images: [
      {
        url: "/TaskTrek.ico",
        width: 1200,
        height: 630,
        alt: "TaskTrek Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <OpenInSafariNotice />
    </>
  );
}
