import {database, firestore} from "../config/firebase/FireBaseConfig";
import {FollowResponseDto} from "../dto/response/FollowResponseDto";
import {getFollowerCount} from "./FollowUserService.GetFollowerCount";
import {IFollowUserService} from "../interface/service/IFollowUserService";

export const getFollowers : IFollowUserService["getFollowers"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('followers')
            .get();

        const followers: FollowResponseDto[] = [];

        if(followSnapshot.empty){
            return followers;
        }

        const followersPromises = followSnapshot.docs.map(async doc => {
            const followerId = doc.data().followerId;
            const userRef = database.ref(`/users/${followerId}`);
            const userSnapshot = await userRef.get();
            const userData = userSnapshot.val();

            return new FollowResponseDto(
                followerId,
                userData.name,
                await getFollowerCount(followerId),
                userData.profile.profileImage
            );
        });

        followers.push(...await Promise.all(followersPromises));

        return followers;
    }catch (error) {
        throw new Error(`Error fetching followers: ${error.message}`);
    }
}