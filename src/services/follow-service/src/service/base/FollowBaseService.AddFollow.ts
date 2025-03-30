import { IFollowBaseService } from "../../interface/service/IFollowBaseService";
import { firestore } from "../../config/firebase/FireBaseConfig"
import * as admin from "firebase-admin";
import {FollowType} from "../../enum/FollowType";

export const addFollow: IFollowBaseService["addFollow"] = async (follow) => {
    try {
        const { userId, followingIds, followType} = follow;

        for (const followingId of followingIds) {
            const followingCollectionRef = firestore.collection('users').doc(userId).collection('following').doc();

            const followQuery = await firestore
                .collection('users')
                .doc(userId)
                .collection('following')
                .where('followingId', '==', followingId)
                .limit(1)
                .get();

            if (!followQuery.empty) {
                await Promise.reject(new Error('User is already following this account'));
            }

            const followerCollection = followType === "user"
                ? firestore.collection('users')
                : firestore.collection('officialArtists');

            const followerCollectionRef = followerCollection.doc(followingId).collection('followers').doc();

            const userRef = firestore.collection('users').doc(userId);
            const followingRef = followerCollection.doc(followingId);


            const batch = firestore.batch();

            batch.set(followingCollectionRef, {
                followingId: followingId,
                followType: followType,
                followAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            batch.set(followerCollectionRef, {
                followerId: userId,
                followType: FollowType.USER,
                followAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            await firestore.runTransaction(async (transaction) => {
                const followingDoc = await transaction.get(userRef);
                if (!followingDoc.exists) {
                    transaction.set(userRef, { followingCount: 1 });
                } else {
                    const currentFollowingCount = followingDoc.data()?.followingCount || 0;
                    transaction.update(userRef, { followingCount: currentFollowingCount + 1 });
                }
            });

            await firestore.runTransaction(async (transaction) => {
                const followerDoc = await transaction.get(followingRef);
                if (!followerDoc.exists) {
                    transaction.set(followingRef, { followerCount: 1 });
                } else {
                    const currentFollowerCount = followerDoc.data()?.followerCount || 0;
                    transaction.update(followingRef, { followerCount: currentFollowerCount + 1 });
                }
            });
        }
    } catch (error) {
        console.error('Error in follow:', error);
        throw error;
    }
}