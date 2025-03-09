import { singleton } from "tsyringe";

@singleton()
export class MusicUserMediator {
    private handlers = new Map();

    register(type: any, handler: any): void {
        this.handlers.set(type, handler);
        console.log(`✅ [MusicUserMediator] Registered handler for ${type.name}`);
    }

    async send(command: any) {
        const handler = this.handlers.get(command.constructor);
        if (!handler) {
            const errorMessage = `❌ [MusicUserMediator] No handler registered for command type: ${command.constructor.name}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            console.log(`🔹 [MusicUserMediator] Executing handler for ${command.constructor.name}`);
            return await handler.execute(command);
        } catch (error) {
            console.error(`❌ [MusicUserMediator] Error executing handler for ${command.constructor.name}:`, error);
            throw new Error(`Handler execution failed: ${error.message}`);
        }
    }
}
