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
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Follower_1 = require("../../entity/Follower");
const UserObject_1 = require("../../entity/UserObject");
const AuthtokenObject_1 = require("../../entity/AuthtokenObject");
const crypto_js_1 = require("crypto-js");
class UserService {
    constructor(factoryDao) {
        this._followDao = factoryDao.getFollowsDao();
        this._userDao = factoryDao.getUserDao();
        this._authtokenDao = factoryDao.getAuthTokenDAO();
        this._s3Dao = factoryDao.getS3DAO();
    }
    login(loginRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling the server
            // const loginRequest = new LoginRequest(alias, password);
            // const loginResponse  = (await new ServerFacade().login(loginRequest));
            // let user = User.fromJson(JSON.stringify(loginResponse.user));
            // let authToken = AuthToken.fromJson(JSON.stringify(loginResponse.token));
            // console.log(user);
            // let user = FakeData.instance.firstUser;
            // let authToken = FakeData.instance.authToken
            const authtoken = tweeter_shared_1.AuthToken.Generate();
            yield this._authtokenDao.putAuth(new AuthtokenObject_1.AuthTokenObject(authtoken.token, authtoken.timestamp, loginRequest._alias));
            console.log("added to the auth table");
            let userObject = yield this._userDao.getUser(loginRequest._alias);
            if (userObject === null) {
                throw new Error("[Bad Request] requested user does not exist");
            }
            let hashedPassword = (0, crypto_js_1.SHA256)(loginRequest._password);
            if (hashedPassword.toString(crypto_js_1.enc.Base64) !== (userObject === null || userObject === void 0 ? void 0 : userObject._password)) {
                throw new Error("Password not correct");
            }
            let user = new tweeter_shared_1.User(userObject._firstName, userObject._lastName, userObject._alias, userObject._url);
            console.log("This is the user:" + user);
            if (authtoken === null) {
                throw new Error("[AuthError] unauthenticated request");
            }
            if (user != null) {
                console.log("This is the user:" + user);
                return new tweeter_shared_1.AuthenticateResponse(true, user, authtoken, "login success");
            }
            else {
                throw new Error("Invalid Login");
            }
            //FakeData.instance.authToken
            //Make login request
            //Send it to the server facade
        });
    }
    ;
    // public returnUserService(): {
    //     return new UserService();
    // }
    register(registerRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not neded now, but will be needed when you make the request to the server in milestone 3
            let imageStringBase64 = Buffer.from(registerRequest._userImageBytes).toString("base64");
            const authtoken = tweeter_shared_1.AuthToken.Generate();
            yield this._authtokenDao.putAuth(new AuthtokenObject_1.AuthTokenObject(authtoken.token, authtoken.timestamp, registerRequest._alias));
            console.log("added to the auth table");
            const url = yield this._s3Dao.putImage(registerRequest._alias, imageStringBase64);
            let hashedPassword = (0, crypto_js_1.SHA256)(registerRequest._password);
            yield this._userDao.putUser(new UserObject_1.UserObject(registerRequest._alias, url, registerRequest._firstName, registerRequest._lastName, hashedPassword.toString(crypto_js_1.enc.Base64), 0, 0));
            console.log("added to the user table");
            // TODO: Replace with the result of calling the server
            // let user = FakeData.instance.firstUser;
            let user = new tweeter_shared_1.User(registerRequest._firstName, registerRequest._lastName, registerRequest._alias, imageStringBase64);
            if (user === null) {
                throw new Error("[Bad Request] requested user does not exist");
            }
            if (authtoken === null) {
                throw new Error("[AuthError] unauthenticated request");
            }
            if (user != null) {
                return new tweeter_shared_1.AuthenticateResponse(true, user, authtoken, "register success");
            }
            else {
                throw new Error("Invalid Login");
            }
        });
    }
    ;
    getFollowersCount(getFollowersCountRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const deserializedRequest = tweeter_shared_1.GetFollowersCountRequest.fromJson(getFollowersCountRequest);
            console.log("Deserialized Request:" + deserializedRequest);
            console.log("Deserialized alias:" + deserializedRequest._user.alias);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                if (deserializedRequest._user === null) {
                    throw new Error("[Bad Request] requested user does not exist");
                }
                else {
                    let userObject = yield this._userDao.getUser(deserializedRequest._user.alias);
                    if ((userObject === null || userObject === void 0 ? void 0 : userObject._followerCount) == undefined) {
                        return new tweeter_shared_1.GetFollowersCountResponse(true, 0, "Get Followers Count Success!");
                    }
                    return new tweeter_shared_1.GetFollowersCountResponse(true, userObject === null || userObject === void 0 ? void 0 : userObject._followerCount, "Get Followers Count Success!");
                }
            }
        });
    }
    ;
    getFolloweesCount(getFollowersCountRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            const deserializedRequest = tweeter_shared_1.GetFollowersCountRequest.fromJson(getFollowersCountRequest);
            console.log("Deserialized Request:" + deserializedRequest);
            console.log("Deserialized Request:" + deserializedRequest._user);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                if (deserializedRequest._user === null) {
                    console.log(deserializedRequest._user);
                    throw new Error("[Bad Request] requested user does not exist");
                }
                else {
                    let userObject = yield this._userDao.getUser(deserializedRequest._user.alias);
                    if ((userObject === null || userObject === void 0 ? void 0 : userObject._followeeCount) == undefined) {
                        return new tweeter_shared_1.GetFollowersCountResponse(true, 0, "Get Followers Count Success!");
                    }
                    return new tweeter_shared_1.GetFollowersCountResponse(true, userObject === null || userObject === void 0 ? void 0 : userObject._followeeCount, "Get Followees Count Success!");
                }
            }
            // if (deserializedRequest._user === null) {
            //   throw new Error("[Bad Request] requested user does not exist")
            // }
            // if(deserializedRequest._authToken === null){
            //   throw new Error("[AuthError] unauthenticated request");
            // }
            // else{
            //   return new GetFollowersCountResponse(true, FakeData.instance.getFolloweesCount(deserializedRequest.user), "Get Followees Count Success!")
            // }
        });
    }
    ;
    follow(followRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the following message. Remove when connected to the server
            // await new Promise((f) => setTimeout(f, 2000));
            const deserializedRequest = tweeter_shared_1.GetFollowersCountRequest.fromJson(followRequest);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                const alias = yield this._authtokenDao.getAlias(deserializedRequest._authToken);
                if (alias == undefined) {
                    throw new Error("Alias is undefined");
                }
                const user = yield this._userDao.getUser(alias);
                if (user == undefined) {
                    throw new Error("user is Undefined");
                }
                const followsOBJ = new Follower_1.follows(alias, deserializedRequest._user.alias, user === null || user === void 0 ? void 0 : user._firstName, deserializedRequest._user.firstName);
                yield this._followDao.putFollows(followsOBJ);
                console.log("Successfully added to the Follows Table");
                yield this._userDao.incrementFolloweesCount(alias);
                yield this._userDao.incrementFollowersCount(deserializedRequest._user.alias);
                console.log("successfully added to the counts");
                return new tweeter_shared_1.TweeterResponse(true, "successfully followed");
            }
            // TODO: Call the server
            // let getFollowersFolloweesCountRequest = new GetFollowersCountRequest(deserializedRequest._authToken, deserializedRequest._user);
            // let followersCount = await this.getFollowersCount(getFollowersFolloweesCountRequest);
            // let followeesCount = await this.getFolloweesCount(getFollowersFolloweesCountRequest);
            // await this._followDao.putFollows(followsOBJ);
            // console.log("Successfully added to the Follows Table");
            // if(followeesCount != null && followersCount != null){
            //   return new TweeterResponse(true, "successfully followed");
            // }
            // else{
            //   return new TweeterResponse(false, "Did not successfully follow");
            // }
        });
    }
    ;
    unfollow(unfollowRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the unfollowing message. Remove when connected to the server
            const deserializedRequest = tweeter_shared_1.GetFollowersCountRequest.fromJson(unfollowRequest);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                const alias = yield this._authtokenDao.getAlias(deserializedRequest._authToken);
                if (alias == undefined) {
                    throw new Error("Alias is undefined");
                }
                const user = yield this._userDao.getUser(alias);
                if (user == undefined) {
                    throw new Error("user is Undefined");
                }
                const unfollowOBJ = new Follower_1.follows(alias, deserializedRequest._user.alias, user === null || user === void 0 ? void 0 : user._firstName, deserializedRequest._user.firstName);
                yield this._followDao.deleteFollows(unfollowOBJ);
                console.log("Successfully added to the Follows Table");
                yield this._userDao.decrementFolloweesCount(alias);
                yield this._userDao.decrementFollowersCount(deserializedRequest._user.alias);
                console.log("successfully added to the counts");
                return new tweeter_shared_1.TweeterResponse(true, "successfully followed");
            }
            // await new Promise((f) => setTimeout(f, 2000));
            // const deserializedRequest = GetFollowersCountRequest.fromJson(unfollowRequest);
            // // TODO: Call the server
            // let getFollowersFolloweesCountRequest = new GetFollowersCountRequest(deserializedRequest._authToken, deserializedRequest._user);
            // let followersCount = await this.getFollowersCount(getFollowersFolloweesCountRequest);
            // let followeesCount = await this.getFolloweesCount(getFollowersFolloweesCountRequest);
            // if(followeesCount != null && followersCount != null){
            //   return new TweeterResponse(true, "successfully unfollowed");
            // }
            // else{
            //   return new TweeterResponse(false, "Did not successfully unfollow");
            // }
        });
    }
    ;
    getIsFollowerStatus(getIsFollowerStatusRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const deserializedRequest = tweeter_shared_1.GetIsFollowerStatusRequest.fromJson(getIsFollowerStatusRequest);
            console.log("Deserialized SelectedUser Alias: " + deserializedRequest._selectedUser.alias);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                const alias = yield this._authtokenDao.getAlias(deserializedRequest._authToken);
                if (alias == undefined) {
                    throw new Error("Alias is undefined");
                }
                const user = yield this._userDao.getUser(alias);
                if (user == undefined) {
                    throw new Error("user is Undefined");
                }
                console.log("User Alias: " + user._alias);
                console.log("User firstName: " + user._firstName);
                console.log("User lastname: " + user._lastName);
                console.log("User password: " + user._password);
                console.log("User url: " + user._url);
                console.log("user Followe: r" + user._followerCount);
                console.log("user followee: " + user._followeeCount);
                const isFollowerOBJ = new Follower_1.follows(deserializedRequest._user.alias, deserializedRequest.selectedUser.alias, deserializedRequest._user.firstName, deserializedRequest._selectedUser.firstName);
                const isFollower = yield this._followDao.getFollowing(isFollowerOBJ);
                if (isFollower == undefined) {
                    throw new Error("isFollower is undefinded when its not supposed to be");
                }
                return new tweeter_shared_1.GetIsFollowerStatusResponse(true, isFollower, "Successfully got throught getIsFollowerStatus");
            }
            // if(deserializedRequest._user == null){
            //   throw new Error("[Bad Request] requested user does not exist")
            // }
            // if(deserializedRequest._authToken == null){
            //   throw new Error("[AuthError] unauthenticated request");
            // }
            // else{
            //   return new GetIsFollowerStatusResponse(true, FakeData.instance.isFollower(), "Successfully got throught getIsFollowerStatus");
            // }
        });
    }
    ;
    logout(logOutRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the logging out message. Delete when the call to the server is implemented.
            // await new Promise((res) => setTimeout(res, 1000));
            const deserializedRequest = tweeter_shared_1.LogOutRequest.fromJson(logOutRequest);
            console.log("Service token:" + deserializedRequest._authToken.token);
            yield this._authtokenDao.deleteToken(deserializedRequest._authToken);
            if (deserializedRequest._authToken != null) {
                return new tweeter_shared_1.TweeterResponse(true, "Successfully logged out");
            }
            else {
                throw new Error("[AuthError] unauthenticated request");
            }
        });
    }
    ;
    getUser(getUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Starting to getUser");
            const deserializedRequest = tweeter_shared_1.GetUserRequest.fromJson(getUserRequest);
            if (!(yield this._authtokenDao.isAuthenticated(deserializedRequest._authToken))) {
                throw new Error("[AuthError] unauthenticated request");
            }
            else {
                console.log("Get User Alias: " + deserializedRequest._alias);
                const userObj = yield this._userDao.getUser(deserializedRequest._alias);
                if (userObj == undefined) {
                    throw new Error("UserObj undefined");
                }
                const user = new tweeter_shared_1.User(userObj === null || userObj === void 0 ? void 0 : userObj._firstName, userObj === null || userObj === void 0 ? void 0 : userObj._lastName, userObj === null || userObj === void 0 ? void 0 : userObj._alias, userObj === null || userObj === void 0 ? void 0 : userObj._url);
                return new tweeter_shared_1.GetUserResponse(true, "Successfully got a User", user);
            }
            // if(deserializedRequest._alias != null){
            //   return new GetUserResponse(true, "Successfully got a User",FakeData.instance.findUserByAlias(deserializedRequest._alias) );
            // }
            // else{
            //   throw new Error("[AuthError] unauthenticated request");
            // }
        });
    }
    ;
}
exports.UserService = UserService;
