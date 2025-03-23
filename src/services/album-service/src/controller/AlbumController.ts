import { Request, Response } from 'express';
import multer from 'multer';
import { albumBaseService } from '../service/base/AlbumBaseService.js';
import { CreateAlbumDto } from '../dto/request/CreateAlbumDto.js';
import { IFile } from '../interface/object/IFile.js';
import {IAlbum} from "../interface/object/IAlbum.js";

const uploadMulter = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("File is not a valid image file"));
        }
    }
});

export class AlbumController {
    createAlbumApi = [
        uploadMulter.fields([
            { name: "coverImage", maxCount: 1 }
        ]),

        async (req: Request, res: Response) => {
            try {
                const { title, officialArtistId, type, musicIds } = req.body;

                const multerFile = (req.files as { coverImage?: Express.Multer.File[] })?.coverImage?.[0];

                if (!multerFile) {
                    res.status(400).json({ 
                        status: 400,
                        success: false,
                        message: "No cover image uploaded" 
                    });
                    return;
                }

                const createAlbumDto = new CreateAlbumDto(
                    title,
                    officialArtistId,
                    type,
                    musicIds ? JSON.parse(musicIds) : undefined
                );

                await createAlbumDto.validate();

                const imgObject: IFile = {
                    originalName: multerFile.originalname,
                    mimetype: multerFile.mimetype,
                    buffer: multerFile.buffer,
                };

                await albumBaseService.createAlbum(createAlbumDto, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: "Album created successfully"
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

    updateAlbumApi = [
        uploadMulter.fields([
            { name: "coverImage", maxCount: 1 }
        ]),

        async (req: Request, res: Response) => {
            try {
                const { title, officialArtistId, type, musicIds } = req.body;
                const albumId = req.params.id;
                const multerFile = (req.files as { coverImage?: Express.Multer.File[] })?.coverImage?.[0];
                
                const updateAlbumDto = new CreateAlbumDto(title, officialArtistId, type, musicIds);

                await updateAlbumDto.validate();
                let imgObject: IFile | undefined;
                if (multerFile) {
                    imgObject = {
                        originalName: multerFile.originalname,
                        mimetype: multerFile.mimetype,
                        buffer: multerFile.buffer,
                    };
                }

                await albumBaseService.updateAlbum(albumId, updateAlbumDto, imgObject);

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Album updated successfully"
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

    async getAlbumById(req: Request, res: Response) {
        try {
            const album = await albumBaseService.getAlbumById(req.params.id);
            res.json(album);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async getAllAlbums(req: Request, res: Response) {
        try {
            const albums = await albumBaseService.getAllAlbums();
            res.json(albums);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateAlbum(req: Request, res: Response) {
        try {
            const updatedAlbum = await albumBaseService.updateAlbum(req.params.id, req.body);
            res.json(updatedAlbum);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteAlbum(req: Request, res: Response) {
        try {
            await albumBaseService.deleteAlbum(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export const albumController = new AlbumController();

