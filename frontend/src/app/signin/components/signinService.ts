export interface SigninInput {
    email: string;
    password: string;
}

export const loginUser = async (data: SigninInput) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Login failed");
    }

    return result;
};
