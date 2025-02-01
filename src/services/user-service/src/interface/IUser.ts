export interface IUser {
    userId: string;
    email: string;
    username: string;
    authentication: {
        salt: string;
        password: string;
    };
    role?: string;
    sessionToken?: string | null;
}
