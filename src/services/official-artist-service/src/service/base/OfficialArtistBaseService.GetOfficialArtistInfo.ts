import {IOfficialArtistBaseService} from "../../interface/service/IOfficialArtistBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IOfficialArtist} from "../../interface/object/IOfficialArtist.js";
import {albumServiceClient} from "../../grpc/client/GrpcClient.js";

export const getOfficialArtistInfo: IOfficialArtistBaseService["getOfficialArtistInfo"] = async (artistId) => {
    try {
        const artistRef = database.ref(`officialArtists/${artistId}`);
        const snapshot = await artistRef.get();

        if (!snapshot.exists()) {
            return null;
        }

        const artist = snapshot.val() as IOfficialArtist;
        const albums = await new Promise((resolve, reject) => {
            albumServiceClient.getAlbumsByArtist({ artistId }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.albums);
                }
            });
        });;

        return {
            ...artist,
            id: artistId,
            albums
        };
    } catch (error) {
        throw new Error("Unknown error occurred while getting official artist info." + error.message);
    }
} 