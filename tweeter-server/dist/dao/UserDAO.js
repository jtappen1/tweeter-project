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
exports.UserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const UserObject_1 = require("../entity/UserObject");
class UserDAO {
    constructor() {
        this.tableName = "users";
        this.alias = "alias";
        this.url = "imageURL";
        this.firstName = "firstName";
        this.lastName = "lastName";
        this.password = "password";
        this.followerCount = "followerCount";
        this.followeeCount = "followeeCount";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    generateUser(alias) {
        return {
            [this.alias]: alias,
        };
    }
    getUser(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateUser(alias),
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item === undefined ||
                output.Item[this.alias] === undefined) {
                return undefined;
            }
            else {
                return new UserObject_1.UserObject(output.Item[this.alias], output.Item[this.url], output.Item[this.firstName], output.Item[this.lastName], output.Item[this.password], output.Item[this.followerCount], output.Item[this.followeeCount]);
            }
        });
    }
    putUser(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("alias" + userObj._alias);
            console.log("firstName: " + userObj._firstName);
            console.log("lastName: " + userObj._lastName);
            console.log("url: " + userObj._url);
            console.log("password: " + userObj._password);
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.alias]: userObj._alias,
                    [this.firstName]: userObj._firstName,
                    [this.lastName]: userObj._lastName,
                    [this.url]: userObj._url,
                    [this.password]: userObj._password,
                    [this.followerCount]: userObj._followerCount,
                    [this.followeeCount]: userObj._followeeCount
                }
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    incrementFollowersCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateUser(alias),
                ExpressionAttributeValues: { ":inc": 1 },
                UpdateExpression: "SET " + this.followerCount + " = " + this.followerCount + " + :inc",
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    incrementFolloweesCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateUser(alias),
                ExpressionAttributeValues: { ":inc": 1 },
                UpdateExpression: "SET " + this.followeeCount + " = " + this.followeeCount + " + :inc",
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    decrementFolloweesCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateUser(alias),
                ExpressionAttributeValues: { ":inc": 1 },
                UpdateExpression: "SET " + this.followeeCount + " = " + this.followeeCount + " - :inc",
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    decrementFollowersCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateUser(alias),
                ExpressionAttributeValues: { ":inc": 1 },
                UpdateExpression: "SET " + this.followerCount + " = " + this.followerCount + " - :inc",
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
}
exports.UserDAO = UserDAO;
