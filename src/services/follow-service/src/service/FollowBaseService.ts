import { addFollow } from './FollowBaseService.AddFollow';
import { getFollowingCount } from './FollowBaseService.GetFollowingCount'
import { getFollowersCount } from './FollowBaseService.GetFollowersCount'
import { getFollowingUsers } from './FollowBaseService.GetFollowingUsers'
import { getFollowers } from './FollowBaseService.GetFollowers'


export const FollowBaseService = {
    followUser: addFollow,
    getFollowingCount,
    getFollowersCount,
    getFollowingUsers,
    getFollowers
}