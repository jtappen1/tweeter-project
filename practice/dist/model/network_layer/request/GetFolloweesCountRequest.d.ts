import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
export declare class GetFolloweesCountRequest {
    private _authToken;
    private _user;
    constructor(authToken: AuthToken, user: User);
    get authToken(): AuthToken;
    get user(): User;
}
