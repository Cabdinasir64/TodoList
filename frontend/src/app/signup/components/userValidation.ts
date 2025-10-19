export interface UserInput {
    username: string;
    email: string;
    password: string;
}

export const validateUser = (data: UserInput) => {
    const errors: Record<string, string> = {};

    if (!data.username || data.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.username = "Username can only contain letters, numbers, and underscores";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!data.password) {
        errors.password = "Password is required";
    } else {
        if (data.password.length < 8)
            errors.password = "Password must be at least 8 characters long";
        else if (!/[A-Z]/.test(data.password))
            errors.password = "Must contain at least one uppercase letter";
        else if (!/[a-z]/.test(data.password))
            errors.password = "Must contain at least one lowercase letter";
        else if (!/[0-9]/.test(data.password))
            errors.password = "Must contain at least one number";
        else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(data.password))
            errors.password = "Must contain at least one special character";
    }

    return errors;
};
