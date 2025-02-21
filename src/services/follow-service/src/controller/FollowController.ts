import { Request, Response } from 'express';
import {FollowUserDto} from "../dto/followUserDto";
import {FollowBaseService} from "../service/FollowBaseService";
class FollowController {
    async followUserApi(req: Request, res: Response) {
        try {
            const { userId, followingId } = req.body;

            const followUserDto = new FollowUserDto(userId, followingId);

            await followUserDto.validate();

            const newFollow = await FollowBaseService.followUser(followUserDto);

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Follow user successful',
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
}

export default new FollowController();