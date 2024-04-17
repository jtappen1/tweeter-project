import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";
export declare class LoadMoreItemsResponse extends TweeterResponse {
    private _items;
    constructor(success: boolean, items: [User[], boolean], message: string);
    get items(): [User[], boolean];
}
