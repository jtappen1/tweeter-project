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
exports.AuthtokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class AuthtokenDAO {
    constructor() {
        this.tableName = "auth";
        this.authtoken = "authtoken";
        this.alias = "alias";
        this.timestamp = "timestamp";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putAuth(authtokenObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.authtoken]: authtokenObject._authtoken,
                    [this.timestamp]: authtokenObject._timeStamp,
                    [this.alias]: authtokenObject._alias
                }
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    deleteToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Auth: " + authToken.token);
            const params = {
                TableName: this.tableName,
                Key: this.generateAuthtoken(authToken),
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    generateAuthtoken(authtoken) {
        return {
            [this.authtoken]: authtoken.token,
        };
    }
    getAlias(authtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateAuthtoken(authtoken),
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item === undefined ||
                output.Item[this.alias] === undefined) {
                return undefined;
            }
            else {
                console.log("Authtoken Dao returns this alias: " + output.Item[this.alias]);
                return output.Item[this.alias];
            }
        });
    }
    isAuthenticated(authtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: this.generateAuthtoken(authtoken),
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item === undefined ||
                output.Item[this.alias] === undefined) {
                return undefined;
            }
            else {
                const timestamp = new Date(output.Item[this.timestamp]).toTimeString();
                const curTime = new Date().toTimeString();
                const [timeStampHours, timeStampMinutes, timeStampSeconds] = timestamp.split(":");
                const [curHours, curMinutes, curSeconds] = curTime.split(":");
                if (curHours !== timeStampHours) {
                    return false;
                }
                else {
                    return this.areLessThanFiveMinutesApart(parseInt(timeStampMinutes), parseInt(curMinutes));
                }
            }
        });
    }
    areLessThanFiveMinutesApart(minute1, minute2) {
        const MINUTES_IN_HOUR = 60;
        const MINUTES_THRESHOLD = 5;
        // Convert minutes to seconds for comparison
        const seconds1 = minute1 * 60;
        const seconds2 = minute2 * 60;
        // Calculate the absolute difference in seconds
        const diffSeconds = Math.abs(seconds1 - seconds2);
        // Check if the difference is more than 5 minutes (300 seconds)
        return diffSeconds < (MINUTES_THRESHOLD * MINUTES_IN_HOUR);
    }
}
exports.AuthtokenDAO = AuthtokenDAO;
