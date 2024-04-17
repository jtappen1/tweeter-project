import { TweeterResponse } from "./TweeterResponse";
export declare class GetIsFollowerStatusResponse extends TweeterResponse {
    private _isFollower;
    constructor(success: boolean, isFollower: boolean, message: string);
    get isFollower(): boolean;
}
