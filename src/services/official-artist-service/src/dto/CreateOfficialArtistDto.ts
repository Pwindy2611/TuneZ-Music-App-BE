import {IsBoolean, IsNotEmpty, IsString, validateOrReject} from "class-validator";

export class CreateOfficialArtistDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsBoolean()
    verified: boolean;
    
    constructor(name: string, verified: boolean) {
        this.name = name;
        this.verified = verified;
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}