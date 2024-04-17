"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserObject = void 0;
class UserObject {
    constructor(alias, url, firstName, lastName, password, followerCount, followeeCount) {
        this._alias = alias;
        this._url = url;
        this._firstName = firstName;
        this._lastName = lastName;
        this._password = password;
        this._followerCount = followerCount;
        this._followeeCount = followeeCount;
    }
}
exports.UserObject = UserObject;
