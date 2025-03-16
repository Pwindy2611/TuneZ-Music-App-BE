export interface OfficialArtistInfo {
    id: string;                     // Mã định danh của nghệ sĩ
    name: string;                   // Tên nghệ sĩ
    profileImageUrl?: string;       // URL ảnh đại diện
    bio?: string;                   // Tiểu sử/ngắn gọn về nghệ sĩ
    genres?: string[];              // Danh sách thể loại âm nhạc
    followersCount?: number;        // Số lượng người theo dõi
    albumCount?: number;            // Số lượng album đã phát hành
    socialLinks?: {                 // Các liên kết mạng xã hội
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        [key: string]: string | undefined;
    };
    topSongs?: Array<{             // Danh sách các bài hát nổi bật
        songId: string;
        title: string;
        duration: number;             // Thời lượng bài hát (theo giây)
        coverImageUrl?: string;       // URL ảnh bìa của bài hát
    }>;
    albums?: Array<{               // Danh sách các album của nghệ sĩ
        albumId: string;
        title: string;
        releaseDate?: string;         // Ngày phát hành (ISO string)
        coverImageUrl?: string;       // URL ảnh bìa của album
    }>;
}
