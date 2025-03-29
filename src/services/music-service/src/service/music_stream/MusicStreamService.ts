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
        
        // Cập nhật state trong context
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
        
        // Lấy thông tin state mới từ context
        const stateInfo = context.getState();
        
        // Lưu trực tiếp vào Redis
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
        // Lấy state từ Redis trước
        const redisState = await musicStreamRepository.getUserMusicState(userId);
        
        // Nếu có state trong Redis và đang phát bài hát khác
        if (redisState.currentMusicId && redisState.currentMusicId !== musicId) {
            // Tạo context mới cho bài hát cũ trong Redis
            const context = await this.getOrCreateContext(userId, redisState.currentMusicId);
            return context.getState();
        }
        
        // Nếu không có state hoặc đang phát bài hát này
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