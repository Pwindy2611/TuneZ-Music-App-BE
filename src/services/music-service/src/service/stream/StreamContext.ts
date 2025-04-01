import { IStreamState, StreamStateInfo } from "../../interface/object/IStreamState.js";
import { StoppedState } from "./state/StoppedState.js";

export class StreamContext {
    private currentState: IStreamState;
    private currentTime: number = 0;

    constructor(
        private musicId: string,
        private userId: string,
    ) {
        this.currentState = new StoppedState(this);
    }

    async updateState(newState: IStreamState): Promise<void> {
        this.currentState = newState;
    }

    getCurrentTime(): number {
        return this.currentTime;
    }

    setCurrentTime(time: number): void {
        this.currentTime = time;
    }

    getMusicId(): string {
        return this.musicId;
    }

    getUserId(): string {
        return this.userId;
    }

    // Delegate methods
    async play(): Promise<void> {
        await this.currentState.play();
    }

    async pause(): Promise<void> {
        await this.currentState.pause();
    }

    async stop(): Promise<void> {
        await this.currentState.stop();
    }

    getState(): StreamStateInfo {
        return this.currentState.getState();
    }
} 