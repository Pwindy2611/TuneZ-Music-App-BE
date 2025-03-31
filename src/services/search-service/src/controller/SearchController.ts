import {Request, Response} from "express";
import {SearchBaseService} from "../service/base/SearchBaseService.js";

class SearchController {
    searchApi = async (req: Request, res: Response) => {
        try {
            const { query } = req.params;
            const musicResult = await SearchBaseService.searchMusic(query);
            const artistResult = await SearchBaseService.searchArtist(query);

            const combinedResults = [...musicResult, ...artistResult].sort(() => Math.random() - 0.5);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Search operation completed successfully',
                data:{
                    combinedResults
                }
            })
        }catch (error){
            console.error('Search processing error:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message,
            });
        }
    }
}

export default new SearchController();