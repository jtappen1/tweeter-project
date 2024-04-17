"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenObject = void 0;
class AuthTokenObject {
    constructor(authtoken, timeStamp, alias) {
        this._authtoken = authtoken;
        this._timeStamp = timeStamp;
        this._alias = alias;
    }
}
exports.AuthTokenObject = AuthTokenObject;
