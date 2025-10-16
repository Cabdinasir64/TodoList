import type { Metadata } from "next";
import NotFound from "./components/notfound";

export const metadata: Metadata = {
    title: "404 - Page Not Found | TaskTrek",
    description:
        "Sorry! The page you're looking for does not exist. Go back to TaskTrek and continue managing your tasks efficiently.",
    openGraph: {
        title: "404 - Page Not Found | TaskTrek",
        description:
            "The page you tried to visit was not found. Return to TaskTrek to keep organizing your tasks easily.",
        url: "https://todo-list-ten-nu-62.vercel.app/404",
        siteName: "TaskTrek",
        images: [
            {
                url: "/tasktrek.png",
                width: 1200,
                height: 630,
                alt: "TaskTrek Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "404 - Page Not Found | TaskTrek",
        description:
            "Sorry! The page you're looking for does not exist. Return to TaskTrek to stay productive.",
        images: ["/tasktrek.png"],
    },
    robots: {
        index: false,
        follow: true,
    },
};

const PageNotFound = () => {
    return (
        <>
            <NotFound />
        </>
    );
};

export default PageNotFound;
