export class GetFollowResponseDto{
    userName: string;
    profilePictureUrl: string;
    followerCount: number;

    constructor(userName: string, followerCount: number, profilePictureUrl: string){
        this.userName = userName;
        this.followerCount = followerCount;
        this.profilePictureUrl = profilePictureUrl;
    }
}