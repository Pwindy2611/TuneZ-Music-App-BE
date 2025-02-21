import {firestore} from "../config/firebase/FireBaseConfig";
import {IHistoryBaseService} from "../interface/IHistoryBaseService";
import * as admin from 'firebase-admin';

export const saveHistory : IHistoryBaseService ["saveHistory"] = async (history)=> {
    try{
        const historyRef =  await firestore
            .collection('users')
            .doc(history.userId)
            .collection('history')
            .add(
                {
                    musicId: history.musicId,
                    listenAt: admin.firestore.FieldValue.serverTimestamp(),
                }
            )
        return historyRef.id;
    }catch (error){
        throw new Error(`Error saving history music: ${error.message}`);

    }
}