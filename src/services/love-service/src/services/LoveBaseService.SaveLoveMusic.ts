import {ILoveBaseService} from "../interface/ILoveBaseService";
import {firestore} from "../config/firebase/FireBaseConfig";

import * as admin from "firebase-admin";

export const saveLoveMusic: ILoveBaseService["saveLoveMusic"] = async (love) => {
    try {
        const loveRef = firestore
            .collection('users')
            .doc(love.userId)
            .collection('love');

        const querySnapshot = await loveRef.where('musicId', '==', love.musicId).get();

        if (!querySnapshot.empty) {
            return Promise.reject( new Error(`Music is exist in your playlist`));
        }

        const newDocRef = await loveRef.add({
            musicId: love.musicId,
            listenAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return newDocRef.id;
    } catch (error) {
        throw new Error(`Error saving love music: ${error.message}`);
    }
};