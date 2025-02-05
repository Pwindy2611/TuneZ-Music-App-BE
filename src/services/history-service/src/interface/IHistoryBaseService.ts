import {IHistory} from "./IHistory";

export interface IHistoryBaseService {
    saveHistory(history: IHistory): Promise<string | undefined>;
    
}