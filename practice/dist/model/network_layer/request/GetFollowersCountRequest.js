"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowersCountRequest = void 0;
const AuthToken_1 = require("../../domain/AuthToken");
const User_1 = require("../../domain/User");
class GetFollowersCountRequest {
    _authToken;
    _user;
    constructor(authToken, user) {
        this._authToken = authToken;
        this._user = user;
    }
    get authToken() {
        return this._authToken;
    }
    // Getter for _user
    get user() {
        return this._user;
    }
    static fromJson(json) {
        const jsonObject = json;
        const deserializedUser = User_1.User.fromJson(JSON.stringify(jsonObject._user));
        if (deserializedUser === null) {
            throw new Error("AuthenticateResponse, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject._user));
        }
        const deserializedToken = AuthToken_1.AuthToken.fromJson(JSON.stringify(jsonObject._token));
        if (deserializedToken === null) {
            throw new Error("AuthenticateResponse, could not deserialize token with json:\n" +
                JSON.stringify(jsonObject._token));
        }
        console.log(deserializedUser.firstName + " " + deserializedToken.token);
        return new GetFollowersCountRequest(deserializedToken, deserializedUser);
    }
}
exports.GetFollowersCountRequest = GetFollowersCountRequest;
