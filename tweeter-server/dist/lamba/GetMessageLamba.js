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
        let splitArray = [];
        for (let i = 0; i < event.Records.length; ++i) {
            const { body } = event.Records[i];
            splitArray = body.split(",");
        }
        console.log("Split Array:" + splitArray);
        // const length = splitArray.length;
        const author = splitArray.pop();
        if (author === undefined) {
            throw new Error("Author is undefined");
        }
        const post = splitArray.pop();
        if (post === undefined) {
            throw new Error("post is undefined");
        }
        const string = splitArray.pop();
        if (string === undefined) {
            throw new Error("Timestamp is undefined");
        }
        const timeStamp = parseInt(string);
        // console.log("Length:", length);
        console.log("Author:", author);
        console.log("Post:", post);
        console.log("TimeStamp:", timeStamp);
        const factoryDao = new DaoFactory_1.DynamoDAOFactory();
        console.log("Split array: " + splitArray);
        yield new StatusService_1.StatusService(factoryDao).writeToFeedTable(splitArray, timeStamp, post, author);
    });
};
exports.handler = handler;
