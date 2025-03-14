import { Request, Response } from 'express';
import {CreatePlaylistDto} from "../dto/request/CreatePlaylistDto.js";
import PlaylistBaseService from "../service/base/PlaylistBaseService.js";
import PlaylistGenerateService from "../service/generate/PlaylistGenerateService.js";
import {IPlaylist} from "../interface/object/IPlaylist.js";
import multer from "multer";
import {IFile} from "../interface/object/IFile.js";
import {IAuthRequest} from "../interface/object/IAuthRequest.js";
import playlistUserService from "../service/user/PlaylistUserService.js";
import {IUserPlaylist} from "../interface/object/IUserPlaylist.js";

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

class PlaylistController {

    createPlaylistApi = [
        uploadMulter.fields([
            { name: "imgFile", maxCount: 1 }
        ]),

        async (req: Request, res: Response) => {
            try {
                const { title, type, value } = req.body;

                const multerFile = (req.files as { imgFile?: Express.Multer.File[] })?.imgFile?.[0];

                if (!multerFile) {
                    res.status(400).json({ message: "No image file uploaded" });
                    return;
                }

                const playlistData: IPlaylist = {
                    title,
                    type,
                    value
                };

                const createPlaylistDto = new CreatePlaylistDto(playlistData);

                await createPlaylistDto.validate();

                const imgObject: IFile = {
                    originalName: multerFile.originalname,
                    mimetype: multerFile.mimetype,
                    buffer: multerFile.buffer,
                };

                const newPlaylist = await PlaylistBaseService.createPlaylist(createPlaylistDto, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "Playlist created successfully",
                    playlist: newPlaylist,
                });

            } catch (error) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    ];
    updatePlaylistApi = [
        uploadMulter.fields([
            { name: "imgFile", maxCount: 1 }
        ]),

        async (req: Request, res: Response) => {
            try {
                const { playlistId, title, type, value } = req.body;

                if (!playlistId) {
                    res.status(400).json({ message: "Playlist ID is required" });
                    return;
                }

                const multerFile = (req.files as { imgFile?: Express.Multer.File[] })?.imgFile?.[0];

                const updatedData: IPlaylist = {
                    title,
                    type,
                    value
                };

                const updatePlaylistDto = new CreatePlaylistDto(updatedData);
                await updatePlaylistDto.validate();

                let imgObject: IFile | undefined;
                if (multerFile) {
                    imgObject = {
                        originalName: multerFile.originalname,
                        mimetype: multerFile.mimetype,
                        buffer: multerFile.buffer,
                    };
                }

                const updatedPlaylist = await PlaylistBaseService.updatePlaylist(playlistId, updatePlaylistDto, imgObject);

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Playlist updated successfully",
                    playlist: updatedPlaylist,
                });

            } catch (error) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                });
            }
        }
    ];
    async generatePlaylistApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if(!userId){
                res.status(401).json({ status: 401, success: false, message: 'Unauthorized' });
                return;
            }

            const playlists = await PlaylistGenerateService.generate(userId);

            if(!playlists){
                res.status(404).json({ status: 404, success: false, message: 'No playlists found for the user' });
                return;
            }

            res.status(200).json({ status: 200, success: true, message: 'Playlists fetched successfully', data: playlists });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createUserPlaylistApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(400).json({ message: "User is unauthorized" });
                return;
            }

            const { title } = req.body;

            await playlistUserService.createUserPlaylist(userId, title);

            res.status(201).json({
                status: 201,
                success: true,
                message: "Playlist created successfully",
            });
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }
    updateUserPlaylistApi = [
        uploadMulter.fields([
            { name: "coverImage", maxCount: 1 }
        ]),
        async (req: IAuthRequest, res: Response) => {
            try {
                const userId = req.userId;

                if (!userId) {
                    res.status(400).json({ message: "User is unauthorized" });
                    return;
                }

                const { playlistId, title, description } = req.body;

                const updatePlaylist: IUserPlaylist = {
                    title,
                    description,
                }

                const multerFile = (req.files as { coverImage?: Express.Multer.File[] })?.coverImage?.[0];

                let coverImage: IFile | undefined;

                if (multerFile) {
                    coverImage = {
                        originalName: multerFile.originalname,
                        mimetype: multerFile.mimetype,
                        buffer: multerFile.buffer,
                    };
                }

                await playlistUserService.updateUserPlaylist(userId, playlistId, updatePlaylist, coverImage);

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Playlist updated successfully",
                });
            }catch (error) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message
                })
            }
        }
    ]
    async deleteUserPlaylistApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(400).json({ message: "User is unauthorized" });
                return;
            }

            const { playlistId } = req.body;

            await playlistUserService.deleteUserPlaylist(userId, playlistId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Playlist deleted successfully",
            });
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            })
        }
    }
    async getUserPlaylistsApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(400).json({ message: "User is unauthorized" });
                return;
            }

            const playlists = await playlistUserService.getUserPlaylists(userId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Playlists fetched successfully",
                data: playlists,
            });
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            })
        }
    }
    async addMusicToUserPlaylistApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(400).json({ message: "User is unauthorized" });
                return;
            }

            const { playlistId, musicId } = req.body;

            await playlistUserService.addMusicToUserPlaylist(userId, playlistId, musicId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Music added to playlist successfully",
            });

        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            })
        }
    }
    async removeMusicFromUserPlaylistApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(400).json({ message: "User is unauthorized" });
                return;
            }

            const { playlistId, musicIds } = req.body;

            await playlistUserService.removeMusicFromUserPlaylist(userId, playlistId, musicIds);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Music removed from playlist successfully",
            });
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            })
        }
    }
}

export default new PlaylistController();