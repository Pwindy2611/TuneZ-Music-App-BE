import { Router } from 'express';
import { albumController } from '../controller/AlbumController.js';

const router = Router();

//CURD
router.post('/createAlbum', albumController.createAlbumApi);
router.put('/updateAlbum/:id', albumController.updateAlbumApi);
router.delete('/deleteAlbum/:id', albumController.deleteAlbum);

//GET REQUEST
router.get('/getAlbumById/:id', albumController.getAlbumById);
router.get('/getAllAlbums', albumController.getAllAlbums);





export default router;

