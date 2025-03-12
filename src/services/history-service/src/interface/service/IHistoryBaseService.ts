import {IHistory} from "../object/IHistory";

export interface IHistoryBaseService {
    saveHistory(history: IHistory): Promise<string | undefined>;
}