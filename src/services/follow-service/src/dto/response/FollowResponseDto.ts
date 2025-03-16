export class FollowResponseDto {
    name: string;
    profileImage: string;
    followerCount: number;

    constructor(name: string, followerCount: number, profileImage: string){
        this.name = name;
        this.followerCount = followerCount;
        this.profileImage = profileImage;
    }
}