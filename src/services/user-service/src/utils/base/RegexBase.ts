export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export function validateUsername(username: string): boolean {
    const usernameRegex = /^(?!.*[._]{2})[a-zA-Z0-9._]{3,16}(?<![._])$/;
    return usernameRegex.test(username);
}