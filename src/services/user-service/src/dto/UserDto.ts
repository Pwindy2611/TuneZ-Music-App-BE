// File: src/services/user-service/src/Dto/UserDto.ts

export class UserDto {
    userId: string;
    email: string;
    username: string;
    role?: string;
    sessionToken?: string | null;

    constructor(userId: string, email: string, username: string, role?: string, sessionToken?: string | null) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.role = role;
        this.sessionToken = sessionToken;
    }
}