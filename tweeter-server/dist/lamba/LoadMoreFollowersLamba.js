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
const FollowService_1 = require("../model/service/FollowService");
const DaoFactory_1 = require("../dao/DaoFactory");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Got into handler for LoadMoreFollowers");
    const factoryDao = new DaoFactory_1.DynamoDAOFactory();
    let response = new FollowService_1.FollowService(factoryDao).loadMoreFollowers(event);
    return response;
});
exports.handler = handler;
