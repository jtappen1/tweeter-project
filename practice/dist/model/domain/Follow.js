"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
class Follow {
    _follower;
    _followee;
    constructor(follower, followee) {
        this._follower = follower;
        this._followee = followee;
    }
    get follower() {
        return this._follower;
    }
    set follower(value) {
        this._follower = value;
    }
    get followee() {
        return this._followee;
    }
    set followee(value) {
        this._followee = value;
    }
}
exports.Follow = Follow;
