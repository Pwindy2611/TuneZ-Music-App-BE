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

            res.status(201).json({status: 201, success: true, message: 'Playlist created successfully', data: playlist });

        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateUserPlaylistApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;

            const userPlaylists = await PlaylistGenerateService.generateUserPlaylist(userId);
            if(!userPlaylists){
                res.status(404).json({ status: 404, success: false, message: 'No playlists found for the user' });
            }

            res.status(200).json({ status: 200, success: true, message: 'User playlists fetched successfully', data: userPlaylists });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateRecentPlaylistApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;
            const recentPlaylist = await PlaylistGenerateService.generateRecentPlaylist(userId, 20, 50);

            if(!recentPlaylist){
                res.status(404).json({ status: 404, success: false, message: 'No recent playlists found for the user' });
            }
            res.status(200).json({ status: 200, success: true, message: 'Recent playlists fetched successfully', data: recentPlaylist });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateThrowBackPlaylistApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;
            const throwBackPlaylist = await PlaylistGenerateService.generateThrowBackPlaylist(userId, 20, 50);

            if(!throwBackPlaylist){
                res.status(404).json({ status: 404, success: false, message: 'No throw back playlists found for the user' });
            }
            res.status(200).json({ status: 200, success: true, message: 'Throw back playlists fetched successfully', data: throwBackPlaylist });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async generateFollowedArtistsPlaylistApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;
            const followedArtistsPlaylists = await PlaylistGenerateService.generateFollowedArtistsPlaylist(userId);
            if(!followedArtistsPlaylists){
                res.status(404).json({ status: 404, success: false, message: 'No playlists found for the followed artists' });
            }
            res.status(200).json({ status: 200, success: true, message: 'Followed artists playlists fetched successfully', data: followedArtistsPlaylists  });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PlaylistController();