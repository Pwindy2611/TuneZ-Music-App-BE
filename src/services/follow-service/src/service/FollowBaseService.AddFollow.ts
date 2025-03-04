import { IFollowBaseService } from "../interface/IFollowBaseService";
import { firestore } from "../config/firebase/FireBaseConfig"
import * as admin from "firebase-admin";
import {FollowType} from "../enum/FollowType";

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
        }
    } catch (error) {
        console.error('Error in follow:', error);
        throw error;
    }
}