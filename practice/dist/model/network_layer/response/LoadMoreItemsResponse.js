"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMoreItemsResponse = void 0;
const TweeterResponse_1 = require("./TweeterResponse");
class LoadMoreItemsResponse extends TweeterResponse_1.TweeterResponse {
    _items;
    constructor(success, items, message) {
        super(success, message);
        this._items = items;
    }
    get items() {
        return this._items;
    }
}
exports.LoadMoreItemsResponse = LoadMoreItemsResponse;
