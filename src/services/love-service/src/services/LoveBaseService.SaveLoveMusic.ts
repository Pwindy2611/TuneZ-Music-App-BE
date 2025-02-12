import {ILoveBaseService} from "../interface/ILoveBaseService";
import {firestore} from "../config/firebase/FireBaseConfig";

import * as admin from "firebase-admin";

export const saveLoveMusic: ILoveBaseService ["saveLoveMusic"] = async (love) => {
    try {
        const loveRef =  await firestore
            .collection('love')
            .doc(love.userId)
            .collection('data')
            .add(
                {
                    musicId: love.musicId,
                    listendAt: admin.firestore.FieldValue.serverTimestamp(),
                }
            )
        return loveRef.id;
    }catch (error) {
        throw new Error(`Error saving love music: ${error.message}`);
    }
}