"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweeterResponse = void 0;
class TweeterResponse {
    _success;
    _message;
    constructor(success, message = null) {
        this._success = success;
        this._message = message;
    }
    get success() {
        return this._success;
    }
    get message() {
        return this._message;
    }
}
exports.TweeterResponse = TweeterResponse;
