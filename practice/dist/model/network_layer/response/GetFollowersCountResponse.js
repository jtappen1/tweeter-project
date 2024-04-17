"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowersCountResponse = void 0;
const TweeterResponse_1 = require("./TweeterResponse");
class GetFollowersCountResponse extends TweeterResponse_1.TweeterResponse {
    _followersCount;
    constructor(success, followersCount, message) {
        super(success, message);
        this._followersCount = followersCount;
    }
    get followersCount() {
        return this._followersCount;
    }
}
exports.GetFollowersCountResponse = GetFollowersCountResponse;
