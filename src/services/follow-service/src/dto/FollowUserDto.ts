import { IsString, IsNotEmpty, validateOrReject } from 'class-validator';
import { auth, database } from '../config/firebase/FireBaseConfig';

export class FollowUserDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    followingId: string;

    @IsString()
    @IsNotEmpty()
    followingName: string;

    @IsString()
    @IsNotEmpty()
    followType: string;

    constructor(userId: string, userName: string, followingId: string, followingName: string, followType: string) {
        this.userId = userId;
        this.followingId = followingId;
        this.followingName = followingName;
        this.userName = userName;
        this.followType = followType;
    }

    async validate() {
        try {
            await validateOrReject(this);

            try {
                await auth.getUser(this.userId);
            } catch (error) {
                return Promise.reject(new Error(`Invalid userId: ${error.message}`));
            }

            try {
                await auth.getUser(this.followingId);
            } catch (error) {
                const officialArtistRef = database.ref(`/officialArtist/${this.followingId}`);
                const snapshot = await officialArtistRef.once('value');
                if (!snapshot.exists()) {
                    return Promise.reject(new Error('Invalid followingId: User or official artist not found'));
                }
            }

            return true;
        } catch (errors) {
            if (Array.isArray(errors)) {
                throw new Error(`Validation failed: ${errors.map(error => Object.values(error.constraints)).join(', ')}`);
            } else {
                throw errors;
            }
        }
    }
}