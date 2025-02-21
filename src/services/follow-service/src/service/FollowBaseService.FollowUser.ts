import { IFollowBaseService } from "../interface/IFollowBaseService";
import { firestore } from "../config/firebase/FireBaseConfig"
import * as admin from "firebase-admin";

export const followUser: IFollowBaseService["followUser"] = async (follow) => {
    try {
        const { userId, followingId } = follow;

        const followQuery = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .where('followingId', '==', followingId)
            .limit(1)
            .get();

        if (!followQuery.empty) {
            return Promise.reject(new Error('User is already following this account'));
        }

        const batch = firestore.batch();

        const followingRef = firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .doc();

        batch.set(followingRef, {
            followingId: followingId,
            followAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const followerRef = firestore
            .collection('users')
            .doc(followingId)
            .collection('followers')
            .doc();

        batch.set(followerRef, {
            followerId: userId,
            followAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await batch.commit();

        return followingRef.id;
    } catch (error) {
        console.error('Error in followUser:', error);
        throw error;
    }
}