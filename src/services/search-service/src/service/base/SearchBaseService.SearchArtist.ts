import {ISearchBaseService} from "../../interface/service/ISearchBaseService.js";
import {artistServiceClient} from "../../grpc/client/GrpcClients.js";

export const searchArtist:ISearchBaseService ["searchArtist"] = async (query: string) => {
    try {
        const results = await new Promise((resolve, reject) => {
            artistServiceClient.getAllArtists({}, (error: any, response: any) => {
                if (error) {
                    console.error("Error fetching artist data:", error);
                    reject(error);
                } else {
                    resolve(response.artists);
                }
            })
        });

        const lowercaseQuery = query.toLowerCase();

        return (results as any[]).filter(artist => artist.name.toLowerCase().startsWith(lowercaseQuery)).slice(0,5);
    }catch (error) {
        console.error("Error searching artist:", error);
        throw error
    }
}