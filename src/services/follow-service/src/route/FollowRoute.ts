import express from 'express';
import FollowController from "../controller/FollowController";
const router = express.Router();

//Follow Requests
router.post('/followingUser', FollowController.followUserApi)

//Get Requests
router.post('/getFollowingCount', FollowController.getFollowingCountApi)
router.post('/getFollowersCount', FollowController.getFollowersCountApi)
router.post('/getFollowingUsers', FollowController.getFollowingUserApi)
router.post('/getFollowers', FollowController.getFollowersApi)
export default router;