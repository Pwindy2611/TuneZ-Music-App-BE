import express from 'express';
import FollowController from "../controller/FollowController";
const router = express.Router();

//CRUD Requests
router.post('/addFollowing', FollowController.addFollowApi)
router.post('/unFollow', FollowController.unFollowApi)
//Get Requests
router.get('/getFollowingCount', FollowController.getFollowingCountApi)
router.get('/getFollowersCount', FollowController.getFollowersCountApi)
router.get('/getFollowingUsers', FollowController.getFollowingUserApi)
router.get('/getFollowers', FollowController.getFollowersApi)

export default router;