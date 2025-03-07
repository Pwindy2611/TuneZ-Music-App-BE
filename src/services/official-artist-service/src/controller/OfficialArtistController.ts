import {Request, Response} from "express";
import {CreateOfficialArtistDto} from "../dto/CreateOfficialArtistDto.js";
import {OfficialArtistBaseService} from "../service/OfficialArtistBaseService.js";
import multer from "multer";
import {IOfficialArtist} from "../interface/IOfficialArtist.js";
import {IFile} from "../interface/IFile.js";

const uploadMulter = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.log("File is not a valid music or image file");
        }
    }
});
class OfficialArtistController {
    createOfficialArtistApi = [
        uploadMulter.fields([
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: Request, res: Response) => {
            try {
                const {name, bio, genres} = req.body;
                
                const verified = req.body.verified === "true"
                
                const multerFile = (req.files as { imgFile?: Express.Multer.File[] })?.imgFile?.[0];

                if (!multerFile) {
                    res.status(400).json({ message: "No image file uploaded" });
                    return;
                }
                
                const artistData : IOfficialArtist = {
                    name,
                    verified,
                    profile: {
                        bio,
                        genres,
                    }
                }
                
                const createOfficialArtistDto = new CreateOfficialArtistDto(artistData);

                await createOfficialArtistDto.validate();

                const imgObject: IFile = {
                    originalName: multerFile.originalname,
                    mimetype: multerFile.mimetype,
                    buffer: multerFile.buffer,
                }                
                const newArtist = await OfficialArtistBaseService.createOfficialArtist(createOfficialArtistDto, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: 'Create new official arist successfully',
                    artist: newArtist,
                });
            } catch (error) {
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
    ]
    getAllOfficialArtistApi = async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string;

            const artists = await OfficialArtistBaseService.getAllOfficialArtist(userId);

            if(artists.length === 0){
                res.status(404).json({status: 404, success: false, message: 'No official artists found'});
                return;
            }
            res.status(200).json({status: 200, success: true, artists});
        }catch (error) {
            res.status(500).json({status: 500, success: false, message: error.message});
        }
    }
}

export default new OfficialArtistController();