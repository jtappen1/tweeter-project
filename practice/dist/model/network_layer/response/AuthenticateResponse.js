"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateResponse = void 0;
const User_1 = require("../../domain/User");
const TweeterResponse_1 = require("./TweeterResponse");
const AuthToken_1 = require("../../domain/AuthToken");
class AuthenticateResponse extends TweeterResponse_1.TweeterResponse {
    _user;
    _token;
    constructor(success, user, token, message = null) {
        super(success, message);
        this._user = user;
        this._token = token;
    }
    get user() {
        return this._user;
    }
    get token() {
        return this._token;
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
        return new AuthenticateResponse(jsonObject.success, deserializedUser, deserializedToken, jsonObject.message);
    }
}
exports.AuthenticateResponse = AuthenticateResponse;
