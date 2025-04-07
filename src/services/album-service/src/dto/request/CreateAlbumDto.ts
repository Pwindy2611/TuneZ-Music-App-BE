import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, validateOrReject, IsDateString } from 'class-validator';
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

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    releaseDate: string;

    constructor(
        title: string,
        officialArtistId: string, 
        type: string,
        musicIds?: string[],
        releaseDate: string = new Date().toISOString(),
    ) {
        this.title = title;
        this.officialArtistId = officialArtistId;
        this.type = type;
        this.musicIds = musicIds;
        this.releaseDate = releaseDate;
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