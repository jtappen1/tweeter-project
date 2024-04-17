import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { GetFollowersCountRequest } from "./GetFollowersCountRequest";
export declare class LoadMoreIemsRequest extends GetFollowersCountRequest {
    private _pageSize;
    private _lastItem;
    constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null);
    get pageSize(): number;
    get lastItem(): User | null;
}
