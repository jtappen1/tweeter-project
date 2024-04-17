"use strict";
//interface{}  Getters for Followers and USers Dao
//Interface for login and user 
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const AuthtokenDAO_1 = require("./AuthtokenDAO");
const FeedDAO_1 = require("./FeedDAO");
const FollowsDao_1 = require("./FollowsDao");
const S3DAO_1 = require("./S3DAO");
const StoryDAO_1 = require("./StoryDAO");
const UserDAO_1 = require("./UserDAO");
class DynamoDAOFactory {
    getAuthTokenDAO() {
        return new AuthtokenDAO_1.AuthtokenDAO();
    }
    getUserDao() {
        console.log("Returning new UserDAO");
        return new UserDAO_1.UserDAO();
    }
    getFollowsDao() {
        console.log("returning new FollowsDAO");
        return new FollowsDao_1.FollowsDAO();
    }
    getStoryDAO() {
        return new StoryDAO_1.StoryDAO();
    }
    getFeedDAO() {
        return new FeedDAO_1.FeedDAO();
    }
    getS3DAO() {
        return new S3DAO_1.S3Dao();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
