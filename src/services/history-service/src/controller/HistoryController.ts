import {Request, Response} from "express";
import {IHistory} from "../interface/object/IHistory";
import {SaveHistoryDto} from "../dto/request/SaveHistoryDto";
import {HistoryBaseService} from "../service/HistoryBaseService";
import {HistoryUserService} from "../service/HistoryUserService";
import {IAuthRequest} from "../interface/object/IAuthRequest";

class HistoryController {
    saveHistoryApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            if (!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
            const { musicId } = req.body;

            const historyData: IHistory = {
                userId,
                musicId
            }

            const saveHistoryDto = new SaveHistoryDto(historyData);

            await saveHistoryDto.validate();

            const newHistory = await HistoryBaseService.saveHistory(saveHistoryDto);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Save new history successfully',
                newHistory
            });
        }catch (error : any) {
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
    getMusicIdsFromUserHistoryApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
            const limit = Number(req.query.limit);

            const musicIds = await HistoryUserService.getMusicIdsByUserHistory(userId, limit);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get music ids from user history successfully',
                data: musicIds
            })
        }catch (error) {
            res.status(500).json({status: 500, success: false, error: error.message });
        }
    }
}

export default new HistoryController();