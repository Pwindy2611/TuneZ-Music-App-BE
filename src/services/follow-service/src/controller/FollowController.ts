import { Request, Response } from 'express';
import {FollowCreateDto} from "../dto/request/FollowCreateDto";
import {FollowBaseService} from "../service/FollowBaseService";
import {FollowUserService} from "../service/FollowUserService";
class FollowController {
    async addFollowApi(req: Request, res: Response) {
        try {
            const { userId, followingIds, followType} = req.body;

            const followUserDto = new FollowCreateDto(userId, followingIds, followType);

            await followUserDto.validate();

            const newFollow = await FollowBaseService.addFollow(followUserDto);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'FollowCreateDto  successful',
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

            const count = await FollowUserService.getFollowingCount(userId);

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

            const count = await FollowUserService.getFollowersCount(userId);

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

            const followingList = await FollowUserService.getFollowingUsers(userId);

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

            const followersList = await FollowUserService.getFollowers(userId);

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
    async unFollowApi(req: Request, res: Response) {
        try {
            const {userId, followingId} = req.body;

            await FollowBaseService.unFollow(userId, followingId);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Unfollow successful'
            });
        }catch (error){
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            })
        }
    }
}

export default new FollowController();