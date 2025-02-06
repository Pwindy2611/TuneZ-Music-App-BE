import {database, firestore} from '../../config/firebase/FireBaseConfig.js'
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";

export async function fetchHistoryBase(userId: string, limit: number) {
    const historySnapshot = await firestore
        .collection(`history`)
        .doc(userId)
        .collection('data')
        .limit(limit)
        .get()
    
    if (historySnapshot.empty) return [];

    const musicIds = historySnapshot.docs.map(doc => doc.data().musicId);

    const musicPromises = musicIds.map(async (musicId) => {
        const musicRef = database.ref(`musics/${musicId}`);
        const musicSnap = await  musicRef.get();
        const musicData = musicSnap.val();

        return new GetMusicResponseDto(
            musicData.name,
            musicData.artist,
            musicData.duration,
            musicData.category,
            musicData.loveCount || 0,
            musicData.playCount || 0,
            musicData.musicPath
        );
    });

    return await Promise.all(musicPromises);
}

export async function analyzeUserHistory(userId: string) {
    const history = await fetchHistoryBase(userId, 50);

    const artistCount: Record<string, number> = {};
    const categoryCount: Record<string, number> = {};
    
    history.forEach(record => {
        if(record.artist){
            artistCount[record.artist] = (artistCount[record.artist] || 0) + 1;
        }
        
        if(record.category){
            categoryCount[record.category] = (categoryCount[record.category] || 0) + 1;
        }
    })

    return { artistCount, categoryCount };
}

function getTopItems(count: Record<string, number>, topN = 3) {
    // Chuyển đối tượng thành mảng các cặp [key, count]
    const items = Object.entries(count);
    // Sắp xếp giảm dần theo count
    items.sort((a, b) => b[1] - a[1]);
    // Lấy top N
    return items.slice(0, topN).map(item => item[0]);
}

export async function getUserPreferences(userId: string) {
    const { artistCount, categoryCount } = await analyzeUserHistory(userId);

    const topArtists = getTopItems(artistCount, 3);      // Ví dụ: 3 nghệ sĩ được ưu tiên nhất
    const topCategories = getTopItems(categoryCount, 3);   // Ví dụ: 3 thể loại được ưu tiên nhất

    return { topArtists, topCategories };
}