import {Request, Response} from "express";
import {CreateOfficialArtistDto} from "../dto/request/CreateOfficialArtistDto.js";
import {OfficialArtistBaseService} from "../service/base/OfficialArtistBaseService.js";
import multer from "multer";
import {IOfficialArtist} from "../interface/object/IOfficialArtist.js";
import {IFile} from "../interface/object/IFile.js";
import {OfficialArtistUserService} from "../service/user/OfficialArtistUserService.js";
import {IAuthRequest} from "../interface/object/IAuthRequest.js";

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
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: error.message
                })
            }
        }
    ]

    updateOfficialArtistApi = [
        uploadMulter.fields([
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: Request, res: Response) => {
            try {
                const { artistId } = req.params;
                const { name, bio, genres } = req.body;
                const verified = req.body.verified === "true";

                const multerFile = (req.files as { imgFile?: Express.Multer.File[] })?.imgFile?.[0];
                
                const artistData: IOfficialArtist = {
                    name,
                    verified,
                    profile: {
                        bio,
                        genres,
                    }
                }

                const imgObject: IFile | undefined = multerFile ? {
                    originalName: multerFile.originalname,
                    mimetype: multerFile.mimetype,
                    buffer: multerFile.buffer,
                } : undefined;

                const updatedArtist = await OfficialArtistBaseService.updateOfficialArtist(artistId, artistData, imgObject);

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Update official artist successfully',
                    artist: updatedArtist,
                });
            } catch (error) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: error.message
                });
            }
        }
    ]

    deleteOfficialArtistApi = async (req: Request, res: Response) => {
        try {
            const { artistId } = req.params;
            const deletedArtist = await OfficialArtistBaseService.deleteOfficialArtist(artistId);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Delete official artist successfully',
                artist: deletedArtist,
            });
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }


    getOfficialArtistInfoApi = async (req: Request, res: Response) => {
        try {
            const artistId  = req.params.artistId;
            const artistInfo = await OfficialArtistBaseService.getOfficialArtistInfo(artistId);

            if (!artistInfo) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Official artist not found'
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                artist: artistInfo
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    getAllOfficialArtistApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'User is not authorized'
                })
                return;
            }

            const artists = await OfficialArtistUserService.getAllOfficialArtist(userId);

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