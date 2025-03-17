import { Router } from 'express';
import { albumController } from '../controller/AlbumController.js';

const router = Router();

router.post('/createAlbum', albumController.createAlbumApi);

router.post('/updateAlbum/:id', albumController.updateAlbumApi);

router.get('/getAlbumById/:id', albumController.getAlbumById);

router.get('/getAllAlbums', albumController.getAllAlbums);

router.delete('/deleteAlbum/:id', albumController.deleteAlbum);



export default router;

