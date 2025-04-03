import {ILoveBaseService} from "../../interface/service/ILoveBaseService.js";
import {firestore} from "../../config/firebase/FireBaseConfig.js";

export const unLoveMusic: ILoveBaseService['unLoveMusic'] = async (userId: string, musicId: string): Promise<void> => {
    try {
        const loveRef = firestore
            .collection('users')
            .doc(userId)
            .collection('love');

        const querySnapshot = await loveRef.where('musicId', '==', musicId).get();

        if (querySnapshot.empty) {
            console.log('No matching documents found to remove');
            return;
        }

        const batch = firestore.batch();

        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    }catch (error) {
        throw error;
    }
}