import {IMusicRecService} from "../../interface/IMusicRecService.js";
import {auth, firestore} from "../../config/firebase/FireBaseConfig.js";
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";
import {MusicBaseService} from "../music_base/MusicBaseService.js";

export const generateFollowedArtistsPlaylist: IMusicRecService["generateFollowedArtistsPlaylist"] = async (userId, playlistLimit ) => {
    try{
        if(! await auth.getUser(<string>userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }

        const followingRef = firestore.collection('users').doc(userId).collection('following');
        const followingSnapshot = await followingRef.where('followType', '==', 'officialArtist').get();

        const artists = followingSnapshot.docs.map(doc => doc.data().followingName);

        if (artists.length === 0) return null;

        const artistMusicPromises = artists.map(async (artistName) => {
            const musicDetails: GetMusicResponseDto[] = await MusicBaseService.getMusicByArtist.execute(artistName) ?? [];
            return { artistName, musicDetails };
        });

        const artistMusicArray = await Promise.all(artistMusicPromises);

        const playlistByFollowed: Record<string, GetMusicResponseDto[]> = {};
        artistMusicArray.forEach(item => {
            if (item.musicDetails && item.musicDetails.length > 0) {
                const artistName = item.musicDetails[0].artist;
                playlistByFollowed[artistName] = item.musicDetails;
            }
        });

        return Object.keys(playlistByFollowed).length > 0 ? { playlistByFollowed } : null;


    }catch (error) {
        if (error instanceof Error) {
            throw new Error("Error generating user playlist: " + error.message);
        }
        throw new Error("Unknown error occurred while generating recent playlist.");
    }
}