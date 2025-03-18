import FetchBase from "./FetchBase.js";

class HistoryBase {
    async analyzeUserHistory(userId: string) {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const history = await FetchBase.fetchMusicDetails(musicIds);

        const artistCount: Record<string, number> = {};
        const genresCount: Record<string, number> = {};

        history.forEach(record => {
            if(record.artist){
                artistCount[record.artist] = (artistCount[record.artist] || 0) + 1;
            }

            if(record.genres){
                genresCount[record.genres] = (genresCount[record.genres] || 0) + 1;
            }
        })

        return { artistCount, genresCount };
    }

    getTopItems(count: Record<string, number>, topN = 3) {
        const items = Object.entries(count);
        items.sort((a, b) => b[1] - a[1]);
        return items.slice(0, topN).map(item => item[0]);
    }

    async getUserPreferences(userId: string) {
        const { artistCount, genresCount } = await this.analyzeUserHistory(userId);

        const topArtists = this.getTopItems(artistCount, 3);
        const topGenres = this.getTopItems(genresCount, 3);

        return { topArtists, topGenres };
    }

    async getHistoryCount(userId: string) {
         const history = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
         return history.length;
    }
}

export default new HistoryBase();