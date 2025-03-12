import {IHistoryUserService} from "../interface/service/IHistoryUserService";
import {firestore} from "../config/firebase/FireBaseConfig";

export const getMusicIdsByUserHistory: IHistoryUserService["getMusicIdsByUserHistory"] = async (userId, limit) => {
    try {
        const historySnapshot = await firestore
            .collection(`users`)
            .doc(userId)
            .collection('history')
            .orderBy('listenAt', 'desc')
            .limit(limit)
            .get();

        return historySnapshot.empty ? [] : historySnapshot.docs.map(doc => doc.data().musicId);

    }catch (error) {
        throw new Error(`Get music ids by user history failed: ${error.message}`);
    }
}
