import { IStreamState, StreamStateInfo } from "../../../interface/object/IStreamState.js";
import { StreamContext } from "../StreamContext.js";
import { PlayingState } from "./PlayingState.js";
import { StoppedState } from "./StoppedState.js";

export class PausedState implements IStreamState {
    constructor(private context: StreamContext) {}

    async play(): Promise<void> {
        await this.context.updateState(new PlayingState(this.context));
    }

    async pause(): Promise<void> {
        // Đang ở trạng thái paused, không cần làm gì
    }

    async stop(): Promise<void> {
        await this.context.updateState(new StoppedState(this.context));
    }

    getState(): StreamStateInfo {
        return {
            currentMusicId: this.context.getMusicId(),
            userId: this.context.getUserId(),
            currentTime: this.context.getCurrentTime(),
            isPlaying: false
        };
    }
} 