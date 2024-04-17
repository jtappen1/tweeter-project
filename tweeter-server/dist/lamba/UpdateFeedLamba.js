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
exports.handler = void 0;
const DaoFactory_1 = require("../dao/DaoFactory");
const StatusService_1 = require("../model/service/StatusService");
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = "";
        let post = "";
        let timestamp = "";
        console.log("Event: " + event);
        for (let i = 0; i < event.Records.length; ++i) {
            const { body } = event.Records[i];
            console.log("Body" + body);
            const aliasIndex = body.indexOf("Alias:");
            const postIndex = body.indexOf("Post:");
            const timestampIndex = body.indexOf("Timestamp:");
            if (aliasIndex !== -1) {
                const usernameStartIndex = aliasIndex + "Alias:".length;
                const timeStampStartIndex = timestampIndex + "Timestamp:".length;
                const postStartIndex = postIndex + "Post:".length;
                username = body.substring(usernameStartIndex, timeStampStartIndex - "Timestamp:".length).trim();
                timestamp = body.substring(timeStampStartIndex, postStartIndex - "Post:".length).trim();
                post = body.substring(postStartIndex).trim();
                console.log("Username:" + username);
                console.log("Timestamp:" + timestamp);
                console.log("Post:" + post);
            }
            else {
                console.log("DID NOT FIND ALIAS IN BODY TEXT");
                return null; // "Alias:" substring not found
            }
        }
        const factoryDao = new DaoFactory_1.DynamoDAOFactory();
        console.log("Got to Factory");
        let response = yield new StatusService_1.StatusService(factoryDao).getFollowers(username, timestamp, post);
        console.log(response);
    });
};
exports.handler = handler;
