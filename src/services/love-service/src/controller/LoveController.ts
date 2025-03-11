import {Request, Response} from "express";
import {ILove} from "../interface/object/ILove";
import {SaveMusicDto} from "../dto/request/SaveMusicDto";
import {LoveBaseService} from "../service/LoveBaseService";
import {LoveUserService} from "../service/LoveUserService";

class LoveController {
    saveLoveMusicApi = async (req: Request, res: Response) => {
        try {
            const {musicId, userId} = req.body || req.params;

            const loveData: ILove = {
                musicId,
                userId
            }
            const saveMusicDto = new SaveMusicDto(loveData);

            await saveMusicDto.validate()

            const newLoveMusic = await LoveBaseService.saveLoveMusic(saveMusicDto)

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
    getMusicIdsByUserLoveApi = async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string;
            const limit = Number(req.query.limit);

            const musicIds = await LoveUserService.getMusicIdsByUserLove(userId, limit);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get music ids by user love successfully',
                musicIds
            })
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message,
            })
        }
    }
}

export default new LoveController();
