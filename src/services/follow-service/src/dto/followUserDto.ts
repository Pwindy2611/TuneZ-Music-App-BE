import { IsString, IsNotEmpty, validateOrReject } from 'class-validator';
import { auth, database } from '../config/firebase/FireBaseConfig';

export class FollowUserDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    followingId: string;

    constructor(userId: string, followingId: string) {
        this.userId = userId;
        this.followingId = followingId;
    }

    async validate() {
        try {
            await validateOrReject(this);

            // Check if userId exists in Firebase Authentication
            try {
                await auth.getUser(this.userId);
            } catch (error) {
                return Promise.reject(new Error(`Invalid userId: ${error.message}`));
            }

            // Check if followingId exists in Firebase Authentication
            try {
                await auth.getUser(this.followingId);
            } catch (error) {
                // If not found in Authentication, check in Realtime Database
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