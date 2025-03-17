import {Response } from 'express';
import {FollowCreateDto} from "../dto/request/FollowCreateDto";
import {FollowBaseService} from "../service/FollowBaseService";
import {FollowUserService} from "../service/FollowUserService";
import {IAuthRequest} from "../interface/object/IAuthRequest";
class FollowController {
    async addFollowApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
            const { followingIds, followType} = req.body;

            const followUserDto = new FollowCreateDto(userId, followingIds, followType);

            await followUserDto.validate();

            const newFollow = await FollowBaseService.addFollow(followUserDto);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Follow successful',
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
    async getFollowingCountApi(req: IAuthRequest, res: Response) {
        try {
            const userId  = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
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
    async getFollowersCountApi(req: IAuthRequest, res: Response) {
        try {
            const  userId  = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }
            const count = await FollowUserService.getFollowerCount(userId);

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
    async getFollowingUserApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

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
    async getFollowersApi(req:IAuthRequest, res: Response){
        try {
            const userId = req.userId;

            if(!userId){
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

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
    async unFollowApi(req: IAuthRequest, res: Response) {
        try {
            const userId = req.userId;

            if(!userId) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

            const {followingId} = req.body;

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