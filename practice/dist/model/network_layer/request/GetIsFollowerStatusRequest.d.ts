import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { GetFollowersCountRequest } from "./GetFollowersCountRequest";
export declare class GetIsFollowerStatusRequest extends GetFollowersCountRequest {
    private _selectedUser;
    constructor(authToken: AuthToken, user: User, selectedUser: User);
    get selectedUser(): User;
}
