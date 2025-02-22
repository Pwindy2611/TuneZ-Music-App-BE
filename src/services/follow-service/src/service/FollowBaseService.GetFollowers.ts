import {IFollowBaseService} from "../interface/IFollowBaseService";
import {database, firestore} from "../config/firebase/FireBaseConfig";
import {GetFollowResponseDto} from "../dto/GetFollowResponseDto";
import {getFollowersCount} from "./FollowBaseService.GetFollowersCount";

export const getFollowers : IFollowBaseService["getFollowers"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('followers')
            .get();

        const followers: GetFollowResponseDto[] = [];

        if(followSnapshot.empty){
            return followers;
        }

        const followersPromises = followSnapshot.docs.map(async doc => {
            const userRef = database.ref(`/users/${doc.data().followerId}`);
            const userSnapshot = await userRef.get();
            const userData = userSnapshot.val();

            return {
                userName: userData.username,
                profilePictureUrl: userData.profilePictureUrl,
                followerCount: await getFollowersCount(doc.data().followerId)
            };
        });

        followers.push(...await Promise.all(followersPromises));


        return followers;
    }catch (error) {
        throw new Error(`Error fetching followers: ${error.message}`);
    }
}