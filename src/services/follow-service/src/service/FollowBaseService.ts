import { followUser } from './FollowBaseService.FollowUser';
import { getFollowingCount } from './FollowBaseService.GetFollowingCount'
import { getFollowersCount } from './FollowBaseService.GetFollowersCount'
import { getFollowingUsers } from './FollowBaseService.GetFollowingUsers'
import { getFollowers } from './FollowBaseService.GetFollowers'


export const FollowBaseService = {
    followUser,
    getFollowingCount,
    getFollowersCount,
    getFollowingUsers,
    getFollowers
}