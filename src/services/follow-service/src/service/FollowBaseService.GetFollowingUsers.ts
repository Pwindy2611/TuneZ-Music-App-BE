import {IFollowBaseService} from "../interface/IFollowBaseService";
import {database, firestore} from "../config/firebase/FireBaseConfig";
import {GetFollowResponseDto} from "../dto/GetFollowResponseDto";
import {getFollowersCount} from "./FollowBaseService.GetFollowersCount";

export const getFollowingUsers: IFollowBaseService ["getFollowingUsers"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .get();

        const followingUsers: GetFollowResponseDto[] = [];

        if(followSnapshot.empty){
            return followingUsers;
        }

        const followingUsersPromises = followSnapshot.docs.map(async doc => {
            const userRef = database.ref(`/users/${doc.data().followingId}`);
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