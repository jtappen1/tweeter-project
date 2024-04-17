"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    constructor(factoryDao) {
        this._followDao = factoryDao.getFollowsDao();
        this._userDao = factoryDao.getUserDao();
    }
    loadMoreFollowers(
    // authToken: AuthToken,
    // user: User,
    // pageSize: number,
    // lastItem: User | null
    loadMoreItemsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // const loadMoreItemsRequest = new LoadMoreIemsRequest(authToken,user,pageSize, lastItem)
            // const loadMoreItemsResponse = await (new ServerFacade().loadMoreFollowers(loadMoreItemsRequest));
            // TODO: Replace with the result of calling server
            // console.log(loadMoreItemsRequest);
            const request = tweeter_shared_1.LoadMoreIemsRequest.fromJson(loadMoreItemsRequest);
            console.log("User: " + request._user),
                console.log("LastItem: " + request.lastItem);
            console.log("PageSize:" + request.pageSize);
            let followArray = yield this._followDao.getPageOfFollowers(request.lastItem, request.pageSize, request._user);
            let userArray = [];
            for (let i = 0; i < followArray.values.length; i++) {
                let follow = followArray.values[i];
                console.log("follower handle: " + follow._follower_handle);
                const userOBJ = yield this._userDao.getUser(follow._follower_handle);
                if (userOBJ == null) {
                    throw new Error("Userobj null in follow array");
                }
                userArray.push(new tweeter_shared_1.User(userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._firstName, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._lastName, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._alias, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._url));
            }
            // FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize,   request.user)
            console.log("This is the follows: " + followArray.values);
            console.log("this is has more pages: " + followArray.hasMorePages);
            // for(let i =0; i<follows; i++){
            // }
            // let response =  
            let response = new tweeter_shared_1.LoadMoreItemsResponse(true, [userArray, followArray.hasMorePages], "sucessfully loaded more followers");
            return response;
        });
    }
    ;
    //FakeData.instance.getPageOfUsers(lastItem, pageSize, user
    loadMoreFollowees(
    // authToken: AuthToken,
    // user: User,
    // pageSize: number,
    // lastItem: User | null
    loadMoreItemsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            const request = tweeter_shared_1.LoadMoreIemsRequest.fromJson(loadMoreItemsRequest);
            let followArray = yield this._followDao.getPageOfFollowees(request.lastItem, request.pageSize, request._user);
            console.log("This is the follows: " + followArray.values);
            console.log("this is has more pages: " + followArray.hasMorePages);
            let userArray = [];
            for (let i = 0; i < followArray.values.length; i++) {
                let follow = followArray.values[i];
                console.log("follower handle: " + follow._followee_handle);
                const userOBJ = yield this._userDao.getUser(follow._followee_handle);
                if (userOBJ == null) {
                    throw new Error("Userobj null in follow array");
                }
                userArray.push(new tweeter_shared_1.User(userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._firstName, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._lastName, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._alias, userOBJ === null || userOBJ === void 0 ? void 0 : userOBJ._url));
            }
            let response = new tweeter_shared_1.LoadMoreItemsResponse(true, [userArray, followArray.hasMorePages], "sucessfully loaded more followees");
            return response;
        });
    }
    ;
}
exports.FollowService = FollowService;
