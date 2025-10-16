interface UserInput {
    username: string;
    email: string;
    password: string;
}

export const validateUser = (data: UserInput) => {
    const errors: string[] = [];

    if (!data.username || data.username.trim().length < 3) {
        errors.push("Username must be at least 3 characters long");
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push("Username can only contain letters, numbers, and underscores");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push("Please enter a valid email address");
    }

    if (!data.password) {
        errors.push("Password is required");
    } else {
        if (data.password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(data.password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(data.password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/[0-9]/.test(data.password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
            errors.push("Password must contain at least one special character");
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
