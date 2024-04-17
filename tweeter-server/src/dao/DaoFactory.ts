//interface{}  Getters for Followers and USers Dao
//Interface for login and user 

import { AuthtokenDAO } from "./AuthtokenDAO";
import { FeedDAO } from "./FeedDAO";
import { FollowsDAO } from "./FollowsDao";
import { AuthtokenDAOInterface, FeedDAOInterface, FollowsDAOInterface, IDaoFactory, S3DAOInterface, StoryDAOInterface, UserDAOInterface } from "./IDaoFactory";
import { S3Dao } from "./S3DAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export class DynamoDAOFactory implements IDaoFactory{
    getAuthTokenDAO(): AuthtokenDAOInterface {
        return new AuthtokenDAO();
    }
    getUserDao(): UserDAOInterface {
        console.log("Returning new UserDAO");
        return new UserDAO();
    }
    getFollowsDao(): FollowsDAOInterface{
        console.log("returning new FollowsDAO");
        return new FollowsDAO();
    }
    getStoryDAO(): StoryDAOInterface {
        return new StoryDAO();
    }
    getFeedDAO(): FeedDAOInterface {
        return new FeedDAO();
    }
    getS3DAO(): S3DAOInterface {
        return new S3Dao();
    }
}