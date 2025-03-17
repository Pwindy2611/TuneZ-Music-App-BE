import {IsString, IsNotEmpty, validateOrReject, IsArray} from 'class-validator';
import { auth, database } from '../../config/firebase/FireBaseConfig';

export class FollowCreateDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsArray()
    @IsNotEmpty()
    followingIds: string[];

    @IsString()
    @IsNotEmpty()
    followType: string;

    constructor(userId: string, followingIds: string[], followType: string) {
        this.userId = userId;
        this.followingIds = followingIds;
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
                for (const followingId of this.followingIds) {
                    const officialArtistRef = database.ref(`/officialArtists/${followingId}`);
                    const snapshot = await officialArtistRef.once('value');
                    if (!snapshot.exists()) {
                        await auth.getUser(followingId);
                    }
                }
            } catch (error) {
                return Promise.reject(new Error(`Invalid followingId: ${error.message}`));
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