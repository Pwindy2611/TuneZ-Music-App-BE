import {IsBoolean, IsNotEmpty, IsString, validateOrReject} from "class-validator";
import {IOfficialArtist} from "../../interface/object/IOfficialArtist.js";

export class CreateOfficialArtistDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsBoolean()
    verified: boolean;
    
    profile: {
        bio: string;
        profileImage?: string;
        genres: string[];
    }

    social?: {
        twitter: string;
        facebook: string;
        instagram: string;
    }

    constructor(artist: IOfficialArtist) {
        this.name = artist.name;
        this.verified = artist.verified;
        this.profile = artist.profile;
        this.social = artist.social;
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}