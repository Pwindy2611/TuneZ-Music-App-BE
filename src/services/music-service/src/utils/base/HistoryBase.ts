import {fetchMusicDetails, fetchMusicIdsFromHistory} from "./FetchBase.js";

export async function analyzeUserHistory(userId: string) {
    const musicIds = await fetchMusicIdsFromHistory(userId, 50);
    const history = await fetchMusicDetails(musicIds);

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
    const items = Object.entries(count);
    items.sort((a, b) => b[1] - a[1]);
    return items.slice(0, topN).map(item => item[0]);
}

export async function getUserPreferences(userId: string) {
    const { artistCount, categoryCount } = await analyzeUserHistory(userId);

    const topArtists = getTopItems(artistCount, 3); 
    const topCategories = getTopItems(categoryCount, 3);

    return { topArtists, topCategories };
}