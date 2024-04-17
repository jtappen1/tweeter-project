"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIsFollowerStatusRequest = void 0;
const GetFollowersCountRequest_1 = require("./GetFollowersCountRequest");
class GetIsFollowerStatusRequest extends GetFollowersCountRequest_1.GetFollowersCountRequest {
    _selectedUser;
    constructor(authToken, user, selectedUser) {
        super(authToken, user);
        this._selectedUser = selectedUser;
    }
    get selectedUser() {
        return this._selectedUser;
    }
}
exports.GetIsFollowerStatusRequest = GetIsFollowerStatusRequest;
