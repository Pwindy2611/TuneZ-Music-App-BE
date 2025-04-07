import { IStreamState, StreamStateInfo } from "../../../interface/object/IStreamState.js";
import { StreamContext } from "../StreamContext.js";
import { PlayingState } from "./PlayingState.js";

export class StoppedState implements IStreamState {
    constructor(private context: StreamContext) {}

    async play(): Promise<void> {
        await this.context.updateState(new PlayingState(this.context));
    }

    async pause(): Promise<void> {
        // Không thể pause khi đã stop
        throw new Error("Cannot pause in stopped state");
    }

    async stop(): Promise<void> {
        // Đang ở trạng thái stopped, không cần làm gì
    }

    getState(): StreamStateInfo {
        return {
            currentMusicId: this.context.getMusicId(),
            userId: this.context.getUserId(),
            currentTime: 0,
            isPlaying: false
        };
    }
} 