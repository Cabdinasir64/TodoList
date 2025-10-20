import type { Metadata } from "next";
import SignupForm from "../../components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Sign Up | TaskTrek",
    description: "Create your TaskTrek account and start managing your tasks efficiently.",
};

export default function SignUpPage() {
    return (
        <div>
            <SignupForm />
        </div>
    );
}
