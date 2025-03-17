import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, validateOrReject } from 'class-validator';
import { database } from '../../config/firebase/FireBaseConfig.js';


export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    officialArtistId: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsOptional()
    @IsArray()
    musicIds?: string[];

    constructor(
        title: string,
        officialArtistId: string, 
        type: string,
        musicIds?: string[]
    ) {
        this.title = title;
        this.officialArtistId = officialArtistId;
        this.type = type;
        this.musicIds = musicIds;
    }

    async validate() {
        try {
            await validateOrReject(this);

            const artistSnapshot = await database.ref('officialArtists').child(this.officialArtistId).get();
            if (!artistSnapshot.exists()) {
                throw new Error('Artist does not exist');
            }

        } catch (errors) {
            if (Array.isArray(errors)) {
                throw new Error(`Validation error: ${errors.map(error => Object.values(error.constraints)).join(', ')}`);
            }
            throw errors;
        }
    }
} 