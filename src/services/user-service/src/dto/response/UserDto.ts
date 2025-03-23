
import {IUser} from "../../interface/object/IUser.js";
import {SubscriptionType} from "../../enum/SubscriptionType.js";

export class UserDto {
    _id: string;
    email: string;
    username: string;
    account? : {
        subscriptionType: SubscriptionType,
        createdAt: Date,
        lastLogin: Date,
    }
    role?: string;
    sessionToken?: string | null;

    constructor(user: IUser) {
        this._id = user._id;
        this.email = user.email;
        this.username = user.username;
        this.role = user.role;
        this.account = user.account ;
        this.sessionToken = user.sessionToken;
    }
}