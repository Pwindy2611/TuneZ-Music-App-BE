import { IFollowBaseService } from "../interface/IFollowBaseService";
import { firestore } from "../config/firebase/FireBaseConfig"
import * as admin from "firebase-admin";
import {FollowType} from "../enum/FollowType";

export const followUser: IFollowBaseService["followUser"] = async (follow) => {
    try {
        const { userId, userName, followingId, followingName, followType} = follow;

        let followingCollectionRef;
        let followerCollectionRef;

        if (followType === "user") {
            followingCollectionRef = firestore.collection('users').doc(userId).collection('following').doc();
            followerCollectionRef = firestore.collection('users').doc(followingId).collection('followers').doc();
        } else if (followType === "officialArtist") {
            followingCollectionRef = firestore.collection('users').doc(userId).collection('following').doc();
            followerCollectionRef = firestore.collection('officialArtists').doc(followingId).collection('followers').doc();
        } else {
            return Promise.reject(new Error('Invalid following type'));
        }

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


        batch.set(followingCollectionRef, {
            followingName: followingName,
            followingId: followingId,
            followType: followType,
            followAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        batch.set(followerCollectionRef, {
            followerName: userName,
            followerId: userId,
            followType: FollowType.USER,
            followAt: admin.firestore.FieldValue.serverTimestamp(),
         });

        await batch.commit();

        return followingCollectionRef.id;
    } catch (error) {
        console.error('Error in followUser:', error);
        throw error;
    }
}