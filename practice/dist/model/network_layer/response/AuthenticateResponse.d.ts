import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";
import { AuthToken } from "../../domain/AuthToken";
export declare class AuthenticateResponse extends TweeterResponse {
    private _user;
    private _token;
    constructor(success: boolean, user: User, token: AuthToken, message?: string | null);
    get user(): User;
    get token(): AuthToken;
    static fromJson(json: AuthenticateResponse): AuthenticateResponse;
}
