import {IHistory} from "../../interface/object/IHistory";
import { IsString, IsDate, IsOptional, validateOrReject } from 'class-validator';
import {database} from "../../config/firebase/FireBaseConfig";

export class SaveHistoryDto implements IHistory{
    @IsString()
    userId: string;
    
    @IsString()
    musicId: string;
    
    @IsDate()
    @IsOptional()
    listenedAt: Date | undefined;
    
    constructor(history: IHistory) {
        this.userId = history.userId;
        this.musicId = history.musicId;
    }

    async validate() {
        try {
            await validateOrReject(this);

            const userRef = database.ref(`users/${this.userId}`);
            const userSnapshot = await userRef.once('value');
            if (!userSnapshot.exists()) {
                return Promise.reject(new Error(`Validation failed: user is invalid`));
            }

            const musicRef = database.ref(`musics/${this.musicId}`);
            const musicSnapshot = await musicRef.once('value');
            if (!musicSnapshot.exists()) {
                return Promise.reject(new Error(`Validation failed: music is invalid`));
            }

            return true;
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }



}