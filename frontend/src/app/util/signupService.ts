import { UserInput } from "./userValidation";

export const createUser = async (data: UserInput) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.errors?.[0] || result.message || "Signup failed");
    }

    return result;
};
