import { database, firestore } from "../../config/firebase/FireBaseConfig";
import { FollowResponseDto } from "../../dto/response/FollowResponseDto";
import { getFollowerCount } from "./FollowUserService.GetFollowerCount";
import { IFollowing } from "../../interface/object/IFollowing";
import { IFollowUserService } from "../../interface/service/IFollowUserService";

const getUserData = async (id: string, type: string): Promise<FollowResponseDto | null> => {
    const path = type === 'user' ? `users/${id}` : `officialArtists/${id}`;
    const userRef = database.ref(path);

    try {
        const snapshot = await userRef.once('value');
        if (!snapshot.exists()) {
            console.warn(`${type} data not found for ID: ${id}`);
            return null;
        }

        const data = snapshot.val();
        return new FollowResponseDto(
            id,
            data.name,
            await getFollowerCount(id),
            data.profile.profileImage
        );
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return null;
    }
};

export const getFollowingUsers: IFollowUserService["getFollowingUsers"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .get();

        if (followSnapshot.empty) {
            return [];
        }

        const followingPromises = followSnapshot.docs.map(async (doc) => {
            const following = doc.data() as IFollowing;
            return getUserData(following.followingId, following.followType);
        });

        const results = await Promise.all(followingPromises);
        return results.filter((user): user is FollowResponseDto => user !== null);

    } catch (error) {
        throw new Error(`Error when fetching following users: ${error.message}`);
    }
};