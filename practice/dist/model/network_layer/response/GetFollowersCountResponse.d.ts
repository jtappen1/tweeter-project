import { TweeterResponse } from "./TweeterResponse";
export declare class GetFollowersCountResponse extends TweeterResponse {
    private _followersCount;
    constructor(success: boolean, followersCount: number | PromiseLike<number>, message: string);
    get followersCount(): number | PromiseLike<number>;
}
