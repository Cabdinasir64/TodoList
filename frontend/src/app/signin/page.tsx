import type { Metadata } from "next";
import SigninForm from "./components/SigninForm";

export const metadata: Metadata = {
    title: "Sign In | TaskTrek",
    description: "Sign in to your TaskTrek account and manage your tasks efficiently.",
};

export default function SignInPage() {
    return <SigninForm />;
}
