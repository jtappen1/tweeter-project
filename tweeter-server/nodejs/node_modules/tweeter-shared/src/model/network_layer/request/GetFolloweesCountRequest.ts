import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";

export class GetFolloweesCountRequest{
    private _authToken: AuthToken;
    private _user: User;

    constructor(authToken: AuthToken, user: User){
        this._authToken = authToken;
        this._user= user;
    }

    public get authToken(): AuthToken {
        return this._authToken;
    }

    // Getter for _user
    public get user(): User {
        return this._user;
    }

}