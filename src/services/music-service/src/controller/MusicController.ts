import multer from 'multer'
import {Request, Response} from "express";
import {MusicBaseService} from "../service/base/MusicBaseService.js";
import {IMusicFile} from "../interface/object/IMusicFile.js";
import {CreateMusicDto} from "../dto/request/CreateMusicDto.js";
import {IMusic} from "../interface/object/IMusic.js";
import {SongType} from "../enum/SongType.js";
import {UploadMusicDto} from "../dto/request/UploadMusicDto.js";
import {MusicUserService} from "../service/user/MusicUserService.js";
import {IAuthRequest} from "../interface/object/IAuthRequest.js";
import {musicBaseRepository, musicStreamRepository, musicStreamService} from "../config/container/Container.js";
import "reflect-metadata";
import {IMusicGenre} from "../interface/object/IMusicGenre.js";

const uploadMulter = multer({
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.log("File is not a valid music or image file");
        }
    }
});

class MusicController {
    createMusicApi = [
        uploadMulter.fields([
            { name: "musicFile", maxCount: 1 },
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: Request, res: Response) => {
            try {
                const { name, artist, duration, genres, officialArtistId, lyrics } = req.body;

                const arrGenres: IMusicGenre[] = JSON.parse(genres);

                const musicData: IMusic = {
                    name,
                    songType: SongType.OFFICIAL,
                    artist,
                    duration: Number(duration),
                    genres: arrGenres,
                    officialArtistId,
                    lyrics: lyrics || ""
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

                const newMusic = await MusicBaseService.createMusic.execute(musicData, musicObject, imgObject);

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

    updateMusicApi = async (req: Request, res: Response) => {
        try {
            const musicId = req.params.musicId;
            const updateData: IMusic = {
                ...req.body,
            };
            const updatedMusic = await MusicBaseService.updateMusic.execute(musicId, updateData);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music updated successfully',
                data: updatedMusic
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }

    uploadMusicByUserApi = [
        uploadMulter.fields([
            { name: "musicFile", maxCount: 1 },
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: IAuthRequest, res: Response) => {
            try {
                const userId = req.userId;

                if (!userId) {
                    res.status(401).send("Unauthorized");
                    return;
                }
                const { name, artist, duration, genres, lyrics } = req.body;

                const arrGenres: IMusicGenre[] = JSON.parse(genres);

                const musicData: IMusic = {
                    name,
                    songType: SongType.USER_GENERATED,
                    artist,
                    duration: Number(duration),
                    genres: arrGenres,
                    userId,
                    lyrics: lyrics || ""
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

                const newMusic = await MusicUserService.uploadMusicByUser.execute(musicData, musicObject, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: 'User uploaded music successfully',
                    music: newMusic,
                });
            } catch (error) {
                console.error('Unexpected error while uploading user music');
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: error.message,
                });
            }
        },
    ];
    getAllMusicsApi = async (_req: Request, res: Response) => {
        try {
            const musics = await MusicBaseService.getAllMusic.execute();

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched all music successfully',
                data: musics,
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
    getMusicByArtistApi = async (req: Request, res: Response) => {
        try {
            const artist  = req.query.artist as string;

            if (!artist) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Artist is required',
                });
                return;
            }

            const musicsByArtist = await MusicBaseService.getMusicByArtist.execute(artist);

            if (musicsByArtist?.length === 0) {
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
                data: musicsByArtist,
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
    getMusicByGenresApi = async (req: Request, res: Response) => {
        try {
            const genres  = req.query.genres as string;

            if (!genres) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Genres is required',
                });
                return;
            }

            const musicsByGenres = await MusicBaseService.getMusicByCategory.execute(genres);

            if (musicsByGenres?.length === 0) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: `No music found for Genres: ${genres}`,
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: `Fetched music by Genres: ${genres}`,
                data: musicsByGenres,
            });
        } catch (error: unknown) {
            console.error('Error fetching music by Genres:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    };
    getMusicHistoryApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }
            const musicHistory = await MusicUserService.getMusicHistory.execute(userId);

            if(musicHistory?.length === 0) {
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
                data: musicHistory,
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
    getMusicLoveApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicLove = await MusicUserService.getMusicLove.execute(userId);

            if(musicLove?.length === 0) {
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
                message: `Fetched music love with: ${userId}`,
                data: musicLove,
            });
        }catch (error: unknown) {
            console.error('Error fetching music love:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    }
    getUserMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicUser = await MusicUserService.getUserMusic.execute(userId);

            if(musicUser?.length === 0) {
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
                message: `Fetched music user with: ${userId}`,
                data: musicUser,
            });
        }catch (error) {
            console.error('Error fetching music user:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error: ${error.message}`,
            });
        }
    }
    getMusicInfoApi = async (req: IAuthRequest, res: Response) => {
        try {
            const musicId = req.params.musicId;
            const musicDetail = await MusicBaseService.getMusicById.execute(musicId);

            if(!musicDetail){
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Music is not found'
                })
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                data: {
                    name: musicDetail.name,
                    artist: musicDetail.artist,
                    imgPath: musicDetail.imgPath,
                    lyrics: musicDetail.lyrics,
                }
            })
        }catch (error){
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error " + error.message,
            });
        }
    }
    getStreamMusicApi = async (req: Request, res: Response) => {
        try {
            const musicId = req.params.musicId;
            const musicStream = await musicStreamService.getStreamMusic(musicId);

            res.setHeader("Content-Type", "audio/mpeg");
            musicStream.pipe(res);
        } catch (error) {
            console.error("Error in streaming endpoint:", error);
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error " + error.message,
            });
        }
    }
    playMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const musicId = req.params.musicId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const currentState = await musicStreamService.getUserMusicState(userId, musicId);

            if (currentState.currentMusicId !== musicId) {
                await musicStreamRepository.incrementPlayCount(musicId);
                await musicStreamRepository.saveHistory(userId, musicId);
            }

            await musicStreamService.updateUserMusicState(userId, musicId, 'playing');

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music playing',
                state: await musicStreamService.getUserMusicState(userId, musicId)
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }
    pauseMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicId = req.params.musicId;
            const currentState = await musicStreamService.getUserMusicState(userId, musicId);

            if (!currentState.currentMusicId) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No music is playing',
                });
                return;
            }

            const newTimestamp = await musicStreamRepository.calculateCurrentTimestamp(userId);
            
            const context = await musicStreamService.getOrCreateContext(userId, currentState.currentMusicId);
            context.setCurrentTime(newTimestamp);
            
            await musicStreamService.updateUserMusicState(userId, currentState.currentMusicId, 'paused');

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music paused',
                state: await musicStreamService.getUserMusicState(userId, currentState.currentMusicId)
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }
    seekMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicId = req.params.musicId;
            const seekTime = Number(req.query.seek);

            const currentState = await musicStreamService.getUserMusicState(userId, musicId);
            
            if (!currentState.currentMusicId) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No music is playing',
                });
                return;
            }
            
            const context = await musicStreamService.getOrCreateContext(userId, musicId);
            context.setCurrentTime(seekTime);
            
            const isPlaying = currentState.isPlaying;
            const state = isPlaying ? 'playing' : 'paused';
            await musicStreamService.updateUserMusicState(userId, musicId, state);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music seeked',
                state: await musicStreamService.getUserMusicState(userId, musicId)
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }
    getUserMusicStateApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicId = req.params.musicId;
            const state = await musicStreamService.getUserMusicState(userId, musicId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Fetched user music state",
                state
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }
    incrementLoveCountApi = async (req: Request, res: Response) => {
        try {
            const musicId = req.params.musicId;

            await musicBaseRepository.incrementLoveCount(musicId);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Increment love count successfully',
            });
        }catch (error){
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            })
        }
    }
    deleteMusicApi = async (req: Request, res: Response) => {
        try {
            const musicId = req.params.musicId;
            
            await MusicBaseService.deleteMusic.execute(musicId);
            
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }

    // GENRES APIs
    createGenreApi = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;

            if (!name) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Genre name is required'
                });
                return;
            }

            const genreId = await MusicBaseService.createGenre.execute(name, description);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Genre created successfully',
                data: { id: genreId, name, description }
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }
    getAllGenresApi = async (_req: Request, res: Response) => {
        try {
            const genres = await MusicBaseService.getAllGenres.execute();

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched all genres successfully',
                data: genres
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }
    getGenreByIdApi = async (req: Request, res: Response) => {
        try {
            const genreId = req.params.genreId;
            const genre = await MusicBaseService.getGenreById.execute(genreId);

            if (!genre) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Genre not found'
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched genre successfully',
                data: genre
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }
    updateGenreApi = async (req: Request, res: Response) => {
        try {
            const genreId = req.params.genreId;
            const updateData = req.body;

            if (!updateData.name) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Genre name is required'
                });
                return;
            }

            const updatedGenreId = await MusicBaseService.updateGenre.execute(genreId, updateData);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Genre updated successfully',
                data: { id: updatedGenreId, ...updateData }
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }
    deleteGenreApi = async (req: Request, res: Response) => {
        try {
            const genreId = req.params.genreId;
            
            await MusicBaseService.deleteGenre.execute(genreId);
            
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Genre deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`
            });
        }
    }
}

export default new MusicController();