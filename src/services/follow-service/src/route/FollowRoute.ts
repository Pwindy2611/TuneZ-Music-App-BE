import express from 'express';
import FollowController from "../controller/FollowController";
const router = express.Router();

router.post('/followingUser', FollowController.followUserApi)

export default router;