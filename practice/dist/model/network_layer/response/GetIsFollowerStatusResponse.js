"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIsFollowerStatusResponse = void 0;
const TweeterResponse_1 = require("./TweeterResponse");
class GetIsFollowerStatusResponse extends TweeterResponse_1.TweeterResponse {
    _isFollower;
    constructor(success, isFollower, message) {
        super(success, message);
        this._isFollower = isFollower;
    }
    get isFollower() {
        return this._isFollower;
    }
}
exports.GetIsFollowerStatusResponse = GetIsFollowerStatusResponse;
