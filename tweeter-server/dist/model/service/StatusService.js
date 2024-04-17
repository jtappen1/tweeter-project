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
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StoryObject_1 = require("../../entity/StoryObject");
const client_sqs_1 = require("@aws-sdk/client-sqs");
class StatusService {
    constructor(factoryDao) {
        this.sqsClient = new client_sqs_1.SQSClient();
        this._storyDAO = factoryDao.getStoryDAO();
        this._userDAO = factoryDao.getUserDao();
        this._feedDao = factoryDao.getFeedDAO();
        this._followsDao = factoryDao.getFollowsDao();
    }
    loadMoreStoryItems(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deserializedRequest = tweeter_shared_1.LoadMoreStatusItemsRequest.fromJson(request);
            let storyObjs = yield this._storyDAO.getPageOfStories(deserializedRequest._lastItem, deserializedRequest._pageSize, deserializedRequest._user);
            let storyObjArray = storyObjs.values;
            let storyArray = [];
            for (let i = 0; i < storyObjArray.length; i++) {
                const status = storyObjArray[i];
                const userOBJ = yield this._userDAO.getUser(status._alias);
                if (userOBJ == null) {
                    throw new Error("USER IS NULL IN LOAD MORE STORY ITEMS");
                }
                storyArray.push(new tweeter_shared_1.Status(status._post, new tweeter_shared_1.User(userOBJ._firstName, userOBJ._lastName, userOBJ._alias, userOBJ._url), status._timeStamp));
            }
            // if(deserializedRequest._user != null){
            //   return new LoadMoreStatusItemsResponse(true, FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize), "Successfully loaded Story Items")
            // }
            return new tweeter_shared_1.LoadMoreStatusItemsResponse(true, [storyArray, storyObjs.hasMorePages], "Successfully loaded Story Items");
        });
    }
    ;
    loadMoreFeedItems(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling server
            const deserializedRequest = tweeter_shared_1.LoadMoreStatusItemsRequest.fromJson(request);
            let feedObjects = yield this._feedDao.getPageOfFeeds(deserializedRequest._lastItem, deserializedRequest._pageSize, deserializedRequest._user);
            let feedObjArray = feedObjects.values;
            let feedArray = [];
            for (let i = 0; i < feedObjArray.length; i++) {
                const status = feedObjArray[i];
                const userOBJ = yield this._userDAO.getUser(status._postAuthor);
                if (userOBJ == null) {
                    throw new Error("USER IS NULL IN LOAD MORE STORY ITEMS");
                }
                feedArray.push(new tweeter_shared_1.Status(status._post, new tweeter_shared_1.User(userOBJ._firstName, userOBJ._lastName, userOBJ._alias, userOBJ._url), status._timeStamp));
            }
            // if(deserializedRequest._user != null){
            //   return new LoadMoreStatusItemsResponse(true, FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize), "Successfully loaded Story Items")
            // }
            //FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize)
            return new tweeter_shared_1.LoadMoreStatusItemsResponse(true, [feedArray, feedObjects.hasMorePages], "Successfully loaded Story Items");
        });
    }
    ;
    postStatus(postStatusRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the logging out message. Remove when connected to the server
            // await new Promise((f) => setTimeout(f, 2000));
            const request = tweeter_shared_1.PostStatusRequest.fromJson(postStatusRequest);
            yield this._storyDAO.putStory(new StoryObject_1.StoryObject(request._status.user.alias, request._status.timestamp, request._status.post));
            const userPost = request._status.post;
            const alias = request._status.user.alias;
            yield this.sendMessage(userPost, alias, request._status.timestamp);
            // const followersArray = await this._followsDao.getPageOfFollowers(null, 10, request._status.user);
            // console.log("Followers Array : "+ followersArray.values);
            // for(let i = 0; i < followersArray.values.length; i++){
            //   const follow = followersArray.values[i];
            //   const followAlias = follow._followee_handle;
            //   console.log("This is the followee handle" +followAlias);
            //   await this._feedDao.putFeed(new FeedObject(followAlias, request._status.timestamp, request._status.post, request._status.user.alias));
            // }
            if (request._authToken != null) {
                return new tweeter_shared_1.TweeterResponse(true, "Successfully Posted Status");
            }
            else {
                return new tweeter_shared_1.TweeterResponse(false, "Did not Successfully Post Status");
            }
        });
    }
    getFollowers(alias, timeStamp, post) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Got into GetFollowers" + alias);
            let userObj = yield this._userDAO.getUser(alias);
            console.log("UserOBJ:" + userObj);
            if (userObj == null) {
                throw new Error("user was null in get followers");
            }
            let user = new tweeter_shared_1.User(userObj === null || userObj === void 0 ? void 0 : userObj._firstName, userObj === null || userObj === void 0 ? void 0 : userObj._lastName, userObj === null || userObj === void 0 ? void 0 : userObj._alias, userObj === null || userObj === void 0 ? void 0 : userObj._url);
            console.log("User: " + user);
            let hasMorePages = true;
            // let followersArray = await this._followsDao.getPageOfFollowers(null, 200, user);
            let count = 0;
            let lastItem = null;
            while (hasMorePages) {
                // if(count === 22){
                //   break;
                // }
                count++;
                let followersArray = yield this._followsDao.getPageOfFollowers(lastItem, 1000, user);
                console.log("THIS IS HAS MORE PAGES: " + hasMorePages);
                console.log("Followers Array : " + followersArray.values);
                let comma = "";
                let finalString = "";
                for (let i = 0; i < followersArray.values.length; i++) {
                    const follow = followersArray.values[i];
                    const followAlias = follow._follower_handle;
                    finalString = finalString + comma + followAlias;
                    comma = ",";
                    if (i === followersArray.values.length - 1) {
                        userObj = yield this._userDAO.getUser(followersArray.values[i]._follower_handle);
                        if (userObj == null) {
                            throw new Error("user was null in get followers");
                        }
                        lastItem = new tweeter_shared_1.User(userObj === null || userObj === void 0 ? void 0 : userObj._firstName, userObj === null || userObj === void 0 ? void 0 : userObj._lastName, userObj === null || userObj === void 0 ? void 0 : userObj._alias, userObj === null || userObj === void 0 ? void 0 : userObj._url);
                        console.log("Got last user: " + (lastItem === null || lastItem === void 0 ? void 0 : lastItem.alias));
                    }
                    // await this._feedDao.putFeed(new FeedObject(followAlias, request._status.timestamp, request._status.post, request._status.user.alias));
                }
                finalString = finalString + comma + timeStamp + comma + post + comma + alias;
                console.log("BATCH :" + count);
                yield this.sendMessageToFeedQueue(finalString);
                hasMorePages = followersArray.hasMorePages;
                if (hasMorePages === false) {
                    break;
                }
            }
            return "Finished GetFollowers";
        });
    }
    sendMessage(post, alias, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqs_url = "https://sqs.us-east-2.amazonaws.com/153357736288/StatusQueue";
            const params = {
                DelaySeconds: 10,
                MessageBody: post + "Alias:" + alias + "Timestamp:" + timeStamp + "Post:" + post,
                QueueUrl: sqs_url,
            };
            console.log("Initial send message" + params.MessageBody);
            try {
                const data = yield this.sqsClient.send(new client_sqs_1.SendMessageCommand(params));
                console.log("Success, message sent. MessageID:", data.MessageId);
            }
            catch (err) {
                throw err;
            }
        });
    }
    sendMessageToFeedQueue(followerList) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqs_url = "https://sqs.us-east-2.amazonaws.com/153357736288/FeedQueue";
            const params = {
                DelaySeconds: 10,
                MessageBody: followerList,
                QueueUrl: sqs_url,
            };
            console.log("In SendMessageToFeedQueue");
            try {
                const data = yield this.sqsClient.send(new client_sqs_1.SendMessageCommand(params));
                console.log("Success, message sent. MessageID:", data.MessageId);
            }
            catch (err) {
                throw err;
            }
        });
    }
    writeToFeedTable(followsList, timeStamp, post, author) {
        return __awaiter(this, void 0, void 0, function* () {
            let followLength = followsList.length;
            // console.log("FollowsLength: "+ followLength);
            while (followLength > 25) {
                const shortenedList = followsList.splice(0, 25);
                if (shortenedList == null || shortenedList == undefined) {
                    console.log("Shortened List UNDEFINED");
                }
                // console.log("Shortened List:" + shortenedList)
                yield this._feedDao.createFeedWrite(shortenedList, timeStamp, post, author);
                followLength -= 25;
            }
            // console.log("FINAL FOLLOWS LIST LENGTH:" +followsList.length)
            yield this._feedDao.createFeedWrite(followsList, timeStamp, post, author);
            console.log("ADDED " + followLength + " feed items");
        });
    }
}
exports.StatusService = StatusService;
