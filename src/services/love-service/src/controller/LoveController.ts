import {Request, Response} from "express";
import {ILove} from "../interface/object/ILove.js";
import {SaveMusicDto} from "../dto/request/SaveMusicDto.js";
import {LoveBaseService} from "../service/base/LoveBaseService.js";
import {LoveUserService} from "../service/user/LoveUserService.js";
import {IAuthRequest} from "../interface/object/IAuthRequest.js";

class LoveController {
    saveLoveMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId){
                res.status(401).send({error: "User not found"});
                return;
            }
            const {musicId} = req.body;

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
            console.error('Unexpected error while save history');
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message,
            });
        }
    }

    unLoveMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId){
                res.status(401).send({error: "User not found"});
                return;
            }

            const musicId = req.params.musicId;

            if (!musicId) {
                res.status(400).send({error: "Music ID is required"});
                return;
            }

            await LoveBaseService.unLoveMusic(userId, musicId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully removed music from favorites"
            });

        }catch (error){
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message,
            })
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
