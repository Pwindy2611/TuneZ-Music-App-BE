import {Request, Response} from "express";
import {CreateOfficialArtistDto} from "../dto/CreateOfficialArtistDto.js";
import {OfficialArtistBaseService} from "../services/OfficialArtistBaseService.js";

class OfficialArtistController {
    createOfficialArtistApi = async (req: Request, res: Response) => {
        try {
            const {name, verified} = req.body;

            const createOfficialArtistDto = new CreateOfficialArtistDto(name, verified);

            await createOfficialArtistDto.validate();

            const newArtist = await OfficialArtistBaseService.createOfficialArtist({name, verified});

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Create new official arist successfully',
                artist: newArtist,
            });
        }catch (error) {
            if (error instanceof Error) {
                console.error('Error creating new official arist:', error.message);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message,
                });
            } else {
                console.error('Unexpected error while creating official arist');
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Unexpected error occurred',
                });
            }
        }
    }
}

export default new OfficialArtistController();