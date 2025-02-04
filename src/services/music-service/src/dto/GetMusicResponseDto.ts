export class GetMusicResponseDto {
    name: string;
    artist: string;
    duration: number;
    category: string;
    loveCount: number;
    playCount: number;
    musicPath: string;
    
    constructor(name: string, artist: string, duration: number, category: string, loveCount: number, playCount: number, musicPath: string) {
        this.name = name;
        this.artist = artist;
        this.duration = duration;
        this.category = category;
        this.loveCount = loveCount;
        this.playCount = playCount;
        this.musicPath = musicPath;
    }
}