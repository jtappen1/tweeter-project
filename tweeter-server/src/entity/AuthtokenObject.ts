import { AuthToken } from "tweeter-shared";

export class AuthTokenObject{
    public _authtoken: string;
    public _timeStamp: number;
    public _alias: string;

    constructor(authtoken: string, timeStamp: number, alias: string) {
        this._authtoken = authtoken;
        this._timeStamp = timeStamp;
        this._alias = alias;
    }

}