import {UserRole} from "../enum/UserRole.js";

export interface IUser {
    userId: string;
    email: string;
    username: string;
    authentication: {
        salt: string;
        password: string;
    };
    role?: UserRole;
    sessionToken?: string | null;
}
