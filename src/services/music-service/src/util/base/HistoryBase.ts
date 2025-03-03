import FetchBase from "./FetchBase.js";

class HistoryBase{
     async analyzeUserHistory(userId: string) {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const history = await FetchBase.fetchMusicDetails(musicIds);

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

    getTopItems(count: Record<string, number>, topN = 3) {
        const items = Object.entries(count);
        items.sort((a, b) => b[1] - a[1]);
        return items.slice(0, topN).map(item => item[0]);
    }

    async getUserPreferences(userId: string) {
        const { artistCount, categoryCount } = await this.analyzeUserHistory(userId);

        const topArtists = this.getTopItems(artistCount, 3);
        const topCategories = this.getTopItems(categoryCount, 3);

        return { topArtists, topCategories };
    }
}

export default new HistoryBase();