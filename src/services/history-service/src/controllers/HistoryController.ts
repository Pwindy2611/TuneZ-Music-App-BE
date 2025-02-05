import {Request, Response} from "express";
import {IHistory} from "../interface/IHistory";
import {SaveHistoryDto} from "../dto/SaveHistoryDto";
import {saveHistory} from "../services/HistoryBaseSerice";

export const saveHistoryApi = async (req: Request, res: Response) => {
    try {
        const { userId, musicId } = req.body;
        
        const historyData: IHistory = {
            userId,
            musicId
        }
        
        const saveHistoryDto = new SaveHistoryDto(historyData);
        
        await saveHistoryDto.validate();
        
        const newHistory = await saveHistory(historyData);

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