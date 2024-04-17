"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMoreIemsRequest = void 0;
const GetFollowersCountRequest_1 = require("./GetFollowersCountRequest");
class LoadMoreIemsRequest extends GetFollowersCountRequest_1.GetFollowersCountRequest {
    _pageSize;
    _lastItem;
    constructor(authToken, user, pageSize, lastItem) {
        super(authToken, user);
        this._pageSize = pageSize;
        this._lastItem = lastItem;
    }
    get pageSize() {
        return this._pageSize;
    }
    // Getter for lastItem
    get lastItem() {
        return this._lastItem;
    }
}
exports.LoadMoreIemsRequest = LoadMoreIemsRequest;
