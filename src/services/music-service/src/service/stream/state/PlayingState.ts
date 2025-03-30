import { IStreamState, StreamStateInfo } from "../../../interface/object/IStreamState.js";
import { StreamContext } from "../StreamContext.js";
import { PausedState } from "./PausedState.js";
import { StoppedState } from "./StoppedState.js";

export class PlayingState implements IStreamState {
    constructor(private context: StreamContext) {}

    async play(): Promise<void> {
        // Đang ở trạng thái playing, không cần làm gì
    }

    async pause(): Promise<void> {
        await this.context.updateState(new PausedState(this.context));
    }

    async stop(): Promise<void> {
        await this.context.updateState(new StoppedState(this.context));
    }

    getState(): StreamStateInfo {
        return {
            currentMusicId: this.context.getMusicId(),
            userId: this.context.getUserId(),
            currentTime: this.context.getCurrentTime(),
            isPlaying: true
        };
    }
} 