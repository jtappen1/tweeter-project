"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFolloweesCountResponse = void 0;
const TweeterResponse_1 = require("./TweeterResponse");
class GetFolloweesCountResponse extends TweeterResponse_1.TweeterResponse {
    _followeesCount;
    constructor(success, followeesCount, message) {
        super(success, message);
        this._followeesCount = followeesCount;
    }
    get followeesCount() {
        return this._followeesCount;
    }
}
exports.GetFolloweesCountResponse = GetFolloweesCountResponse;
