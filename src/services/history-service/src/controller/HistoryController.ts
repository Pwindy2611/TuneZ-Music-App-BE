import {Request, Response} from "express";
import {IHistory} from "../interface/object/IHistory";
import {SaveHistoryDto} from "../dto/request/SaveHistoryDto";
import {HistoryBaseService} from "../service/HistoryBaseService";

class HistoryController {
    saveHistoryApi = async (req: Request, res: Response) => {
        try {
            const { userId, musicId } = req.body;

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
}

export default new HistoryController();