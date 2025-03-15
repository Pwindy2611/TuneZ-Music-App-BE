import { ILoveBaseService } from "../interface/service/ILoveBaseService";
import { firestore } from "../config/firebase/FireBaseConfig";
import * as admin from "firebase-admin";
import axios from "axios";
import https from "https";

export const saveLoveMusic: ILoveBaseService["saveLoveMusic"] = async (love) => {
    try {
        const loveRef = firestore
            .collection('users')
            .doc(love.userId)
            .collection('love');

        const querySnapshot = await loveRef.where('musicId', '==', love.musicId).get();

        if (!querySnapshot.empty) {
            return Promise.reject(new Error(`Music is already in your playlist`));
        }

        // Lưu bài hát vào danh sách yêu thích
        const newDocRef = await loveRef.add({
            musicId: love.musicId,
            lovedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        try {
            await axios.post(`http://api-gateway:3000/musics/incrementLoveCount/${love.musicId}`);
        } catch (apiError) {
            console.error(`Failed to increment love count: ${apiError.message}`);
        }

        return newDocRef.id;
    } catch (error) {
        throw new Error(`Error saving love music: ${error.message}`);
    }
};