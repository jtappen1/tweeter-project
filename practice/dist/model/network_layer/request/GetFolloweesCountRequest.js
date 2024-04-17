"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFolloweesCountRequest = void 0;
class GetFolloweesCountRequest {
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
}
exports.GetFolloweesCountRequest = GetFolloweesCountRequest;
