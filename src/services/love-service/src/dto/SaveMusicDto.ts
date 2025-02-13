import {ILove} from "../interface/ILove";
import {IsString, validateOrReject} from "class-validator";
import {database} from '../config/firebase/FireBaseConfig'

export class SaveMusicDto implements ILove{
    @IsString()
    userId: string;
    
    @IsString()
    musicId: string;
    
    constructor(love: ILove) {
        this.userId = love.userId;
        this.musicId = love.musicId;
    }
    
    async validate(){
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

            return true; // Nếu tất cả validation đều hợp lệ, trả về true
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}