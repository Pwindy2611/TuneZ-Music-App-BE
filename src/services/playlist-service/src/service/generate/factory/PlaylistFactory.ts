import HistoryBase from "../../../util/base/HistoryBase.js";
import FetchBase from "../../../util/base/FetchBase.js";
import {HistoryGroup} from "./HistoryGroup.js";
import {FollowedGroup} from "./FollowedGroup.js";
import {UserGroup} from "./UserGroup.js";

export class PlaylistFactory {
    static async getPlaylistGroup(userId: string) {
        const groups = [];

        const historyCount = await HistoryBase.getHistoryCount(userId);
        const followedCount = await FetchBase.getFollowedCount(userId);
        if (historyCount > 0){
            groups.push(new HistoryGroup());
            groups.push(new UserGroup());
        }

        if (followedCount > 0) {
            groups.push(new FollowedGroup());
        }

        return groups;
    }
}