import {firestore} from "../config/firebase/FireBaseConfig";
import {IHistoryBaseService} from "../interface/IHistoryBaseService";
import * as admin from 'firebase-admin';

export const saveHistory : IHistoryBaseService ["saveHistory"] = async (history)=> {
    try{
        const historyRef =  await firestore
            .collection('history')
            .doc(history.userId)
            .collection('data')
            .add(
                {
                    musicId: history.musicId,
                    listendAt: admin.firestore.FieldValue.serverTimestamp(),
                }
            )
        return historyRef.id;
    }catch (error : any){
        
    }
}