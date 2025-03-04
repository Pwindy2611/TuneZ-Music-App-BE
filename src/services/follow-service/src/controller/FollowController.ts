import { Request, Response } from 'express';
import {Follow} from "../dto/Follow";
import {FollowBaseService} from "../service/FollowBaseService";
class FollowController {
    async addFollowApi(req: Request, res: Response) {
        try {
            const { userId, followingIds, followType} = req.body;

            const followUserDto = new Follow(userId, followingIds, followType);

            await followUserDto.validate();

            const newFollow = await FollowBaseService.followUser(followUserDto);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Follow  successful',
                data: newFollow
            });
        }catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }
    async getFollowingCountApi(req: Request, res: Response) {
        try {
            const userId  = req.query.userId as string;

            const count = await FollowBaseService.getFollowingCount(userId);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get following count successful',
                data: count
            });
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }
    async getFollowersCountApi(req: Request, res: Response) {
        try {
            const  userId  = req.query.userId as string;

            const count = await FollowBaseService.getFollowersCount(userId);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get followers count successful',
                data: count
            });
        }catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }
    async getFollowingUserApi(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;

            const followingList = await FollowBaseService.getFollowingUsers(userId);

            if(followingList.length <= 0){
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'No following user found'
                })
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get followers user successful',
                data: followingList
            });
        }catch (error){
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }
    async getFollowersApi(req:Request, res: Response){
        try {
            const userId = req.query.userId as string;

            const followersList = await FollowBaseService.getFollowers(userId);

            if(followersList.length <= 0){
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'No followers user found'
                })
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Get followers user successful',
                data: followersList
            })
        }catch (error){
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            });
        }
    }
}

export default new FollowController();