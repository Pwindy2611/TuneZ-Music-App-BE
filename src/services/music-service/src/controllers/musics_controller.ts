import multer from 'multer'
import {Request, Response} from "express";
import {
    createMusicService,
    getAllMusicService,
    getMusicByArtistService,
    getMusicByCategoryService
} from "../services/musics_services.js";

const uploadMulter = multer({});
export const createMusicApi = [
    uploadMulter.single('musicFile'), // Đặt tên file giống như key trong form-data
    async (req: Request, res: Response) => {
        try {
            const { name, artist, duration, category } = req.body;

            // Lấy thông tin file
            const musicFile = req.file; // File sẽ được multer xử lý và lưu tại đây
            
            // Kiểm tra các trường bắt buộc
            if (!name || !artist || !duration || !category || !musicFile) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'All fields (name, artist, duration, category, musicFile) are required',
                });
                return;
            }
            
            // Tạo đối tượng file cần thiết để upload lên Supabase
            const fileObject = {
                originalname: musicFile.originalname, // Tên file gốc
                mimetype: musicFile.mimetype, // Loại file (ví dụ: audio/mpeg)
                buffer: musicFile.buffer, // Dữ liệu file
            };
            
            // Gọi service để tạo bản ghi mới
            const newMusic = await createMusicService({
                name,
                artist,
                duration,
                category,
                 // Lấy đường dẫn file
            }, fileObject);

            // Trả về kết quả thành công
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


export const getAllMusicsApi = async (req: Request, res: Response) => {
    try {
        const musics = await getAllMusicService();

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

        const musicsByArtist = await getMusicByArtistService(artist);

        if (!musicsByArtist || musicsByArtist.length === 0) {
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

        const musicsByCategory = await getMusicByCategoryService(category);

        if (!musicsByCategory || musicsByCategory.length === 0) {
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
