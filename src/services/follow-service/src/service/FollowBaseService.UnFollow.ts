import {IFollowBaseService} from "../interface/IFollowBaseService";
import {firestore} from "../config/firebase/FireBaseConfig";
import {FollowType} from "../enum/FollowType";

export const unFollow: IFollowBaseService["unFollow"] = async (userId, followingId) => {
    try {
        const followQuery = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .where('followingId', '==', followingId)
            .limit(1)
            .get();

        if (followQuery.empty) {
            return Promise.reject(new Error("User not following the specified user"));
        }

        const batch = firestore.batch();
        const followRef = followQuery.docs[0].ref;
        batch.delete(followRef);

        let followerCollection;

        if(followQuery.docs[0].data().followType === FollowType.ARTIST){
            followerCollection = firestore.collection('officialArtists');
        }
        else{
            followerCollection = firestore.collection('users');
        }

        const followerQuery = await followerCollection
            .doc(followingId)
            .collection('followers')
            .where('followerId', '==', userId)
            .limit(1)
            .get();

        if (!followerQuery.empty) {
            const followerRef = followerQuery.docs[0].ref;
            batch.delete(followerRef);
        }

        await batch.commit();
    } catch (error) {
        throw new Error("Failed to unfollow user: " + error.message);
    }
}