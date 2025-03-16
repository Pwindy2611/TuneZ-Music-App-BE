import {ILoveUserService} from "../interface/service/ILoveUserService.js";
import {firestore} from "../config/firebase/FireBaseConfig.js";

export const getMusicIdsByUserLove: ILoveUserService["getMusicIdsByUserLove"] = async (userId, limit) => {
    try {
        const loveSnapshot = await firestore
            .collection(`users`)
            .doc(userId)
            .collection('love')
            .orderBy('lovedAt', 'desc')
            .limit(limit)
            .get();

        return loveSnapshot.empty ? [] : loveSnapshot.docs.map(doc => doc.data().musicId);
    }catch (error){
        throw new Error('Error in getMusicIdsByUserLove: ' + error.message);
    }
}