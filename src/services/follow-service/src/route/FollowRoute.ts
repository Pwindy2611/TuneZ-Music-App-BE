import express from 'express';
import FollowController from "../controller/FollowController";
import {authMiddleware} from "../util/middleware/AuthMiddleware";
const router = express.Router();

//CRUD Requests
router.post('/addFollowing', authMiddleware, FollowController.addFollowApi)
router.post('/unFollow', authMiddleware, FollowController.unFollowApi)
//Get Requests
router.get('/getFollowingCount', authMiddleware, FollowController.getFollowingCountApi)
router.get('/getFollowersCount', authMiddleware, FollowController.getFollowersCountApi)
router.get('/getFollowingUsers', authMiddleware, FollowController.getFollowingUserApi)
router.get('/getFollowers', authMiddleware, FollowController.getFollowersApi)

export default router;