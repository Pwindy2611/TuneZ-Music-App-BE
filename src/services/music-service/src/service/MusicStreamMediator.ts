import { singleton } from "tsyringe";

@singleton()
export class MusicStreamMediator {
    private handlers = new Map();

    register(type: any, handler: any): void {
        this.handlers.set(type, handler);
        console.log(`✅ [MusicStreamMediator] Registered handler for ${type.name}`);
    }

    async send(command: any) {
        const handler = this.handlers.get(command.constructor);
        if (!handler) {
            const errorMessage = `❌ [MusicStreamMediator] No handler registered for command type: ${command.constructor.name}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            console.log(`🔹 [MusicStreamMediator] Executing handler for ${command.constructor.name}`);
            return await handler.execute(command);
        } catch (error) {
            console.error(`❌ [MusicStreamMediator] Error executing handler for ${command.constructor.name}:`, error);
            throw new Error(`Handler execution failed: ${error.message}`);
        }
    }
}
