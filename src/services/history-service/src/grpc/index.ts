import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { getMusicIdsByUserHistory } from '../service/HistoryUserService.GetMusicIdsByUserHistory';
import { saveHistory } from '../service/HistoryBaseService.SaveHistory';
import { SaveHistoryDto } from '../dto/request/SaveHistoryDto';
import { IHistory } from '../interface/object/IHistory';
import dotenv from 'dotenv';

dotenv.config();

const PROTO_PATH = path.resolve(__dirname, './proto/history.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const historyProto = grpc.loadPackageDefinition(packageDefinition).history;

async function getMusicIds(call: any, callback: any) {
    try {
        const { userId, limit } = call.request;
        const musicIds = await getMusicIdsByUserHistory(userId, limit);
        callback(null, { musicIds });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching music IDs: ${error.message}`
        });
    }
}

async function addMusicId(call: any, callback: any) {
    try {
        const { userId, musicId } = call.request;

        const historyData: IHistory = {
            userId,
            musicId
        }

        const saveHistoryDto = new SaveHistoryDto(historyData);

        await saveHistoryDto.validate();

        const musicIds = await saveHistory(saveHistoryDto);

        callback(null, { musicIds });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Error fetching music IDs: ${error.message}`
        });
    }
}

function startServer() {
    const server = new grpc.Server();
    server.addService((historyProto as any).HistoryService.service, { getMusicIds, addMusicId });

    const host = process.env.GRPC_HOST || '0.0.0.0';
    const port = process.env.GRPC_PORT_HISTORY_SERVICE || '50204';
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`History gRPC server running on ${host}:${port}`);
    });
}

startServer();