import "reflect-metadata";
import { singleton } from "tsyringe";
import { StreamContext } from "./StreamContext.js";
import { StreamStateInfo } from "../../interface/object/IStreamState.js";
import { musicStreamRepository } from "../../config/container/Container.js";

@singleton()
export class MusicStreamService {
    private streamContexts: Map<string, StreamContext> = new Map();

    async updateUserMusicState(userId: string, musicId: string, state: 'playing' | 'paused' | 'stopped'): Promise<void> {
        const context = await this.getOrCreateContext(userId, musicId);
        
        switch(state) {
            case 'playing':
                await context.play();
                break;
            case 'paused':
                await context.pause();
                break;
            case 'stopped':
                await context.stop();
                break;
            default:
                throw new Error('Invalid state');
        }
        
        const stateInfo = context.getState();
        
        await musicStreamRepository.updateUserMusicState(
            userId,
            {
                currentMusicId: musicId,
                timestamp: stateInfo.currentTime,
                lastUpdated: Date.now(),
                isPlaying: stateInfo.isPlaying
            }
        );
    }

    async getUserMusicState(userId: string, musicId: string): Promise<StreamStateInfo> {
        const redisState = await musicStreamRepository.getUserMusicState(userId);
        
        if (redisState.currentMusicId && redisState.currentMusicId !== musicId) {
            const context = await this.getOrCreateContext(userId, redisState.currentMusicId);
            return context.getState();
        }
        
        const context = await this.getOrCreateContext(userId, musicId);
        return context.getState();
    }

    async getStreamMusic(musicId: string): Promise<any> {
        return await musicStreamRepository.getStreamMusic(musicId);
    }

    async getOrCreateContext(userId: string, musicId: string): Promise<StreamContext> {
        const key = `${userId}:${musicId}`;
        if (!this.streamContexts.has(key)) {
            this.streamContexts.set(key, new StreamContext(musicId, userId));
        }
        return this.streamContexts.get(key)!;
    }
}