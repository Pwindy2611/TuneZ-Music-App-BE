import { Request, Response } from 'express';
import {CreatePlaylistDto} from "../dto/CreatePlaylistDto.js";
import {PlaylistBaseService} from "../service/PlaylistBaseService.js";
import {PlaylistGenerateService} from "../service/PlaylistGenerateService.js";
class PlaylistController {
    async createPlaylistApi(req: Request, res: Response) {
        try {
            const {title , type, value} = req.body;

            const createPlaylistDto = new CreatePlaylistDto(title, type, value);

            await createPlaylistDto.validate();

            const playlist = await PlaylistBaseService.createPlaylist(title, type, value);

            res.status(201).json({status: 201, success: true, message: 'Playlist created successfully', playlist });

        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateUserPlaylistApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;

            const userPlaylists = await PlaylistGenerateService.generateUserPlaylist(userId);

            res.status(200).json({ status: 200, success: true, message: 'User playlists fetched successfully', userPlaylists });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PlaylistController();