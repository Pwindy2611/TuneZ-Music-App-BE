export class FollowResponseDto {
    id: string;
    name: string;
    profileImage: string;
    followerCount: number;

    constructor(id: string, name: string, followerCount: number, profileImage: string){
        this.id = id;
        this.name = name;
        this.followerCount = followerCount;
        this.profileImage = profileImage;
    }
}