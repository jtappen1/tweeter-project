import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
export declare class GetFollowersCountRequest {
    private _authToken;
    private _user;
    constructor(authToken: AuthToken, user: User);
    get authToken(): AuthToken;
    get user(): User;
    static fromJson(json: GetFollowersCountRequest): GetFollowersCountRequest;
}
