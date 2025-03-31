import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString, validateOrReject } from 'class-validator';
import { database } from '../../config/firebase/FireBaseConfig.js';

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    officialArtistId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type?: string;

    @IsOptional()
    @IsArray()
    musicIds?: string[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    releaseDate?: string;

    constructor(
        title?: string,
        officialArtistId?: string, 
        type?: string,
        musicIds?: string[],
        releaseDate?: string,
    ) {
        if (title) this.title = title;
        if (officialArtistId) this.officialArtistId = officialArtistId;
        if (type) this.type = type;
        if (musicIds) this.musicIds = musicIds;
        if (releaseDate) this.releaseDate = releaseDate;
    }

    async validate() {
        try {
            await validateOrReject(this);

            if (this.officialArtistId) {
                const artistSnapshot = await database.ref('officialArtists').child(this.officialArtistId).get();
                if (!artistSnapshot.exists()) {
                    throw new Error('Artist does not exist');
                }
            }

        } catch (errors) {
            if (Array.isArray(errors)) {
                throw new Error(`Validation error: ${errors.map(error => Object.values(error.constraints)).join(', ')}`);
            }
            throw errors;
        }
    }
} 