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
exports.StoryDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const StoryObject_1 = require("../entity/StoryObject");
const DataPage_1 = require("../entity/DataPage");
class StoryDAO {
    constructor() {
        this.tableName = "storys";
        this.alias = "alias";
        this.timestamp = "timestamp";
        this.post = "post";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    generateStory(alias, timestamp) {
        return {
            [this.alias]: alias,
            [this.timestamp]: this.timestamp
        };
    }
    putStory(storyObj) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("alias" + storyObj._alias);
            // console.log("firstName: "+ storyObj);
            // console.log("lastName: "+ userObj._lastName);
            // console.log("url: "+ userObj._url);
            // console.log("password: "+ userObj._password);
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.alias]: storyObj._alias,
                    [this.timestamp]: storyObj._timeStamp,
                    [this.post]: storyObj._post
                }
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getPageOfStories(lastItem, limit = 10, user) {
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
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((item) => items.push(new StoryObject_1.StoryObject(item[this.alias], item[this.timestamp], item[this.post])));
            return new DataPage_1.DataPage(items, hasMorePages);
        });
    }
}
exports.StoryDAO = StoryDAO;
