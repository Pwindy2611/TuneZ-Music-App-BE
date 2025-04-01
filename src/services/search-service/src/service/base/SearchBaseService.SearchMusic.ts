import {ISearchBaseService} from "../../interface/service/ISearchBaseService.js";
import {musicServiceClient} from "../../grpc/client/GrpcClients.js";

export const searchMusic: ISearchBaseService["searchMusic"] = async (query: string) => {
    try {
        const results = await new Promise((resolve, reject) => {
            musicServiceClient.getAllMusic({}, (error: any, response: any) => {
                if (error) {
                    console.error("Error fetching music data:", error);
                    reject(error);
                } else {
                    resolve(response.music);
                }
            });
        })


        const lowercaseQuery = query.toLowerCase();
        return (results as any[]).filter(music =>
            music.name.toLowerCase().startsWith(lowercaseQuery) ||
            music.artist.toLowerCase().startsWith(lowercaseQuery)
        ).slice(0, 5);

    } catch (error) {
        console.error("Error searching music:", error);
        throw new Error("Search operation failed");
    }
}