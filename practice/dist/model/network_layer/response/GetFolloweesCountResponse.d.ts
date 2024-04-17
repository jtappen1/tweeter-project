import { TweeterResponse } from "./TweeterResponse";
export declare class GetFolloweesCountResponse extends TweeterResponse {
    private _followeesCount;
    constructor(success: boolean, followeesCount: number | PromiseLike<number>, message: string);
    get followeesCount(): number | PromiseLike<number>;
}
