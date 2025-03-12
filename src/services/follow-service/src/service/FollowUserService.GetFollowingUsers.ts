import {database, firestore} from "../config/firebase/FireBaseConfig";
import {FollowResponseDto} from "../dto/response/FollowResponseDto";
import {getFollowersCount} from "./FollowUserService.GetFollowersCount";
import {IFollowing} from "../interface/object/IFollowing";
import {IFollowUserService} from "../interface/service/IFollowUserService";

export const getFollowingUsers: IFollowUserService ["getFollowingUsers"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .get();

        const followingUsers: FollowResponseDto[] = [];

        if(followSnapshot.empty){
            return followingUsers;
        }

        const followingUsersPromises = followSnapshot.docs.map(async doc => {
            const followingData: IFollowing = doc.data() as IFollowing;
            let userRef;

            if (followingData.followType === 'user') {
                userRef = database.ref(`/users/${followingData.followingId}`);
            } else if (followingData.followType === 'officialArtist') {
                userRef = database.ref(`/officialArtist/${followingData.followingId}`);
            } else {
                throw new Error('Invalid follow type');
            }

            const userSnapshot = await userRef.get();
            const userData = userSnapshot.val();

            return {
                userName: userData.username,
                profilePictureUrl: userData.profilePictureUrl,
                followerCount: await getFollowersCount(doc.data().followingId)
            };
        });

        followingUsers.push(...await Promise.all(followingUsersPromises));


        return followingUsers;
    }catch (error) {
        throw new Error(`Error when fetching following users: ${error.message}`)
    }
}