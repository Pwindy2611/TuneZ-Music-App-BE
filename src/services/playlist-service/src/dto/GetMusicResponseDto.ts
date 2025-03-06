export class GetMusicResponseDto {
    _id: string;
    name: string;
    artist: string;
    genres: string;
    duration: number;
    imgPath: string;
    
    constructor(_id: string,
                name: string,
                artist: string,
                category: string,
                duration: number, 
                imgPath: string,) {
        this._id = _id;
        this.artist = artist;
        this.name = name;
        this.genres = category;
        this.duration = duration;
        this.imgPath = imgPath;
    }
}