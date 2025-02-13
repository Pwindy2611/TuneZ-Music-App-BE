import {Request, Response} from "express";
import {ILove} from "../interface/ILove";
import {SaveMusicDto} from "../dto/SaveMusicDto";
import {saveLoveMusic} from "../services/LoveBaseService";

export const saveLoveMusicApi = async (req: Request, res: Response) => {
    try {
        const {musicId, userId} = req.body || req.params;
        
        const loveData: ILove = {
            musicId, 
            userId
        }
        const saveMusicDto = new SaveMusicDto(loveData);
        
        await saveMusicDto.validate()
        
        const newLoveMusic = await saveLoveMusic(saveMusicDto)

        res.status(201).json({
            status: 201,
            success: true,
            message: 'Save new love successfully',
            newLoveMusic
        });
    }catch (error){
        if (error instanceof Error) {
            console.error('Error save new history:', error.message);
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message,
            });
        } else {
            console.error('Unexpected error while save history');
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Unexpected error occurred',
            });
        }
    }
}