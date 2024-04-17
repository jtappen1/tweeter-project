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
exports.FeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const DataPage_1 = require("../entity/DataPage");
const FeedObject_1 = require("../entity/FeedObject");
const child_process_1 = require("child_process");
class FeedDAO {
    constructor() {
        this.tableName = "feeds";
        this.alias = "alias";
        this.timestamp = "timestamp";
        this.post = "post";
        this.post_author = "post_author";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    generateFeed(alias, timestamp) {
        return {
            [this.alias]: alias,
            [this.timestamp]: timestamp
        };
    }
    putFeed(feedObj) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("alias" + storyObj._alias);
            // console.log("firstName: "+ storyObj);
            // console.log("lastName: "+ userObj._lastName);
            // console.log("url: "+ userObj._url);
            // console.log("password: "+ userObj._password);
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.alias]: feedObj._alias,
                    [this.timestamp]: feedObj._timeStamp,
                    [this.post]: feedObj._post,
                    [this.post_author]: feedObj._postAuthor
                }
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getPageOfFeeds(lastItem, limit = 10, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.alias + " = :v",
                ExpressionAttributeValues: {
                    ":v": user.alias,
                },
                TableName: this.tableName,
                Limit: limit,
                ExclusiveStartKey: lastItem === null
                    ? undefined
                    : {
                        //partition follower
                        //sort followee
                        [this.alias]: user.alias,
                        [this.timestamp]: lastItem === null || lastItem === void 0 ? void 0 : lastItem.timestamp,
                    },
                ScanIndexForward: false
            };
            const items = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push(new FeedObject_1.FeedObject(item[this.alias], item[this.timestamp], item[this.post], item[this.post_author])));
            return new DataPage_1.DataPage(items, hasMorePages);
        });
    }
    createFeedWrite(followsList, timeStamp, post, author) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("In create FeedWrite:" + followsList)
            if (followsList.length == 0) {
                console.log('zero followers to batch write');
                return;
            }
            if (timeStamp == null || timeStamp == undefined) {
                console.log("TimeSTAMP IS NULL" + timeStamp);
            }
            if (author == null || author == undefined) {
                console.log("AUTHOR IS NULL" + author);
            }
            if (post == null || post == undefined) {
                console.log("POST IS NULL" + post);
            }
            else {
                const params = {
                    RequestItems: {
                        [this.tableName]: this.createPutUserRequestItems(followsList, timeStamp, post, author)
                    }
                };
                //   console.log("Item: " + params.RequestItems.feeds.at(0)?.PutRequest.Item)
                yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    yield this.putUnprocessedItems(resp, params, 0);
                }))
                    .catch(err => {
                    var _a;
                    console.log(params.RequestItems.feeds);
                    throw new Error('Error while batchwriting users with params: ' + ((_a = params.RequestItems.feeds.at(params.RequestItems.feeds.length - 1)) === null || _a === void 0 ? void 0 : _a.PutRequest.Item.alias) + ": \n" + err);
                });
                ;
            }
        });
    }
    createPutUserRequestItems(follows_array, timeStamp, post, author) {
        return follows_array.map(follows_obj => this.createPutUserRequest(follows_obj, timeStamp, post, author));
    }
    createPutUserRequest(follows_obj, timestamp, post, author) {
        if (follows_obj == null || follows_obj == undefined) {
            throw new Error("FOLLOWS OBJ UNDEIFNED");
        }
        // console.log("alias:" + follows_obj);
        let item = {
            [this.alias]: follows_obj,
            [this.timestamp]: timestamp,
            [this.post]: post,
            [this.post_author]: author,
        };
        let request = {
            PutRequest: {
                Item: item
            }
        };
        return request;
    }
    // private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput){
    //     console.log("GOT INTO UNPROCESSED ITEMS");
    //   if(resp.UnprocessedItems != undefined){
    //       let sec = 0.01;
    //       while(Object.keys(resp.UnprocessedItems).length > 0) {
    //           console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
    //           //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
    //           // @ts-ignore 
    //           params.RequestItems = resp.UnprocessedItems;
    //           execSync('sleep ' + sec);
    //           if(sec < 1) sec += 0.1;
    //           await this.client.send(new BatchWriteCommand(params));
    //           if(resp.UnprocessedItems == undefined){
    //               break;
    //           }
    //         }
    //     }
    // }
    putUnprocessedItems(resp, params, attempts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (attempts > 1)
                console.log(attempts + 'th attempt starting');
            ;
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.03;
                if (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(Object.keys(resp.UnprocessedItems[this.tableName]).length + ' unprocessed items');
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
                    // @ts-ignore 
                    params.RequestItems = resp.UnprocessedItems;
                    (0, child_process_1.execSync)('sleep ' + sec);
                    if (sec < 10)
                        sec += 0.1;
                    yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params))
                        .then((innerResp) => __awaiter(this, void 0, void 0, function* () {
                        if (innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0) {
                            params.RequestItems = innerResp.UnprocessedItems;
                            ++attempts;
                            yield this.putUnprocessedItems(innerResp, params, attempts);
                        }
                    })).catch(err => {
                        console.log('error while batch writing unprocessed items ' + err);
                    });
                }
            }
        });
    }
}
exports.FeedDAO = FeedDAO;
