import multer from 'multer'
import {Request, Response} from "express";
import {
    createMusic,
    getAllMusic,
    getMusicByArtist,
    getMusicByCategory,
    getMusicHistory,
    uploadMusicByUser
} from "../services/MusicBaseService.js";
import {IMusicFile} from "../interface/IMusicFile.js";
import {CreateMusicDto} from "../dto/CreateMusicDto.js";
import {IMusic} from "../interface/IMusic.js";
import {SongType} from "../enum/SongType.js";
import {UploadMusicDto} from "../dto/UploadMusicDto.js";
import {
    generateThrowBackPlaylist,
    generateRecentPlaylist, 
    generateUserPlaylist
} from "../services/MusicRecService.js";

const uploadMulter = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn file 10MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true); // Chấp nhận file nhạc và ảnh
        } else {
            console.log("File is not a valid music or image file");
        }
    }
});

export const createMusicApi = [
    uploadMulter.fields([
        { name: "musicFile", maxCount: 1 },
        { name: "imgFile", maxCount: 1 }
    ]),
    async (req: Request, res: Response) => {
        try {
            const { name, artist, duration, category, officialArtistId } = req.body;

            const musicData: IMusic = {
                name,
                songType: SongType.OFFICIAL,
                artist,
                duration: Number(duration),
                category,
                officialArtistId
            };

            const createMusicDto = new CreateMusicDto(musicData);
            await createMusicDto.validate();

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const musicFile = files.musicFile?.[0];
            const imgFile = files.imgFile?.[0];

            if (!musicFile) {
                res.status(400).json({ message: "No music file uploaded" });
                return;
            }

            if (!imgFile) {
                res.status(400).json({ message: "No image file uploaded" });
                return;
            }
            
            const musicObject: IMusicFile = {
                originalName: musicFile.originalname,
                mimetype: musicFile.mimetype,
                buffer: musicFile.buffer,
            }
            
            const imgObject: IMusicFile = {
                originalName: imgFile.originalname,
                mimetype: imgFile.mimetype,
                buffer: imgFile.buffer,
            }

            const newMusic = await createMusic(musicData, musicObject, imgObject);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Create new music successfully',
                music: newMusic,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error creating new music:', error.message);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message,
                });
            } else {
                console.error('Unexpected error while creating music');
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Unexpected error occurred',
                });
            }
        }
    },
];

export const uploadMusicByUserApi = [
    uploadMulter.fields([
        { name: "musicFile", maxCount: 1 },
        { name: "imgFile", maxCount: 1 }
    ]),
    async (req: Request, res: Response) => {
        try {
            const { name, artist, duration, category, userId } = req.body;

            const musicData: IMusic = {
                name,
                songType: SongType.USER_GENERATED,
                artist,
                duration: Number(duration),
                category,
                userId
            };

            const uploadMusicDto = new UploadMusicDto(musicData);
            await uploadMusicDto.validate();

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const musicFile = files.musicFile?.[0];
            const imgFile = files.imgFile?.[0];

            if (!musicFile) {
                res.status(400).json({ message: "No music file uploaded" });
                return;
            }

            if (!imgFile) {
                res.status(400).json({ message: "No image file uploaded" });
                return;
            }

            const musicObject: IMusicFile = {
                originalName: musicFile.originalname,
                mimetype: musicFile.mimetype,
                buffer: musicFile.buffer,
            }

            const imgObject: IMusicFile = {
                originalName: imgFile.originalname,
                mimetype: imgFile.mimetype,
                buffer: imgFile.buffer,
            }

            const newMusic = await uploadMusicByUser(musicData, musicObject, imgObject);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'User uploaded music successfully',
                music: newMusic,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error uploading user music:', error.message);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message,
                });
            } else {
                console.error('Unexpected error while uploading user music');
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Unexpected error occurred',
                });
            }
        }
    },
];

export const getAllMusicsApi = async (_req: Request, res: Response) => {
    try {
        const musics = await getAllMusic();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Fetched all music successfully',
            musics,
        });
    } catch (error: unknown) {
        console.error('Error fetching all musics:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const getMusicByArtistApi = async (req: Request, res: Response) => {
    try {
        const { artist } = req.body;

        if (!artist) {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Artist is required',
            });
            return;
        }

        const musicsByArtist = await getMusicByArtist(artist);
        
        if (!musicsByArtist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found for artist: ${artist}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Fetched music by artist: ${artist}`,
            musics: musicsByArtist,
        });
    } catch (error: unknown) {
        console.error('Error fetching music by artist:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const getMusicByCategoryApi = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;

        if (!category) {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Category is required',
            });
            return;
        }

        const musicsByCategory = await getMusicByCategory(category);

        if (!musicsByCategory) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found for category: ${category}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Fetched music by category: ${category}`,
            musics: musicsByCategory,
        });
    } catch (error: unknown) {
        console.error('Error fetching music by category:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const getMusicHistoryApi = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        
        const musicHistory = await getMusicHistory(userId);
        
        if(!musicHistory) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found with: ${userId}`,
            });
            return;
        }
        
        res.status(200).json({
            status: 200,
            success: true,
            message: `Fetched music history with: ${userId}`,
            musics: musicHistory,
        });
    }catch (error: unknown) {
        console.error('Error fetching music history:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const generateUserPlaylistApi = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        
        const userMusicPlaylist = await generateUserPlaylist(userId)
        
        if(!userMusicPlaylist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found with: ${userId}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Generate music playlist successfully with : ${userId}`,
            musics: userMusicPlaylist,
        });
    }catch (error: unknown) {
        console.error('Error generate music playlist:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error generate music playlist ${error}`,
        });
    }
}

export const generateRecentPlaylistApi = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;

        const recentMusicPlaylist = await generateRecentPlaylist(userId, 20, 50);

        if(!recentMusicPlaylist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found with: ${userId}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Generate music playlist successfully with : ${userId}`,
            musics: recentMusicPlaylist,
        });
    }catch (error: unknown) {
        console.error('Error generate music playlist:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error generate music playlist ${error}`,
        });
    }
}

export const generateThrowBackPlaylistApi = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;

        const throwBackMusicPlaylist = await generateThrowBackPlaylist(userId, 20, 50);

        if(!throwBackMusicPlaylist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found with: ${userId}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Generate music playlist successfully with : ${userId}`,
            musics: throwBackMusicPlaylist,
        });
    }catch (error: unknown) {
        console.error('Error generate music playlist:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error generate music playlist ${error}`,
        });
    }
}