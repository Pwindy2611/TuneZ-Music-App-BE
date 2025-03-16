import { ILoveBaseService } from "../interface/service/ILoveBaseService.js";
import { firestore } from "../config/firebase/FireBaseConfig.js";
import { musicServiceClient } from "../grpc/client/GrpcClient.js";
import {Timestamp} from "firebase-admin/firestore";

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

        const newDocRef = await loveRef.add({
            musicId: love.musicId,
            lovedAt: Timestamp.now(),
        });

        try {
            await new Promise((resolve, reject) => {
                musicServiceClient.incrementLoveCount({ musicId: love.musicId }, (error: any, response: any) => {
                    if (error) {
                        reject(new Error(`Failed to increment love count: ${error.message}`));
                    } else {
                        resolve(response);
                    }
                });
            });
        } catch (grpcError) {
            console.error(grpcError.message);
        }

        return newDocRef.id;
    } catch (error) {
        throw new Error(`Error saving love music: ${error.message}`);
    }
};