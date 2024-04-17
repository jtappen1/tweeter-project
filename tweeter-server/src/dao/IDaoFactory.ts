//Has interfaces for the Dao

import { AuthToken, Status, User } from "tweeter-shared";
import { follows } from "../entity/Follower";
import { UserDAO } from "./UserDAO";
import { UserObject } from "../entity/UserObject";
import { AuthTokenObject } from "../entity/AuthtokenObject";
import { DataPage } from "../entity/DataPage";
import { StoryObject } from "../entity/StoryObject";
import { FeedObject } from "../entity/FeedObject";



export interface IDaoFactory{
    getFollowsDao(): FollowsDAOInterface;
    getUserDao(): UserDAOInterface;
    getAuthTokenDAO(): AuthtokenDAOInterface;
    getStoryDAO(): StoryDAOInterface;
    getFeedDAO(): FeedDAOInterface;
    getS3DAO(): S3DAOInterface;
}

export interface StoryDAOInterface{
    putStory(storyObj: StoryObject): Promise<void>;
    getPageOfStories(
        lastItem: Status| null,
        limit: number,
        user: User
      ): Promise<DataPage<StoryObject>>;
    
}

export interface FollowsDAOInterface{
    putFollows(follows: follows) : Promise<void>;
    deleteFollows(follows: follows): Promise<void>
    getFollowing(follows: follows): Promise<boolean | undefined>;
    getPageOfFollowers(lastItem: User| null,limit: number,user: User): Promise<DataPage<follows>>;
    getPageOfFollowees(lastItem: User| null, limit: number, user: User): Promise<DataPage<follows>>
}

export interface UserDAOInterface{
    putUser(userObj: UserObject): Promise<void>;
    getUser(alias: string) : Promise<UserObject | undefined>;
    incrementFollowersCount(alias: string): Promise<void>;
    incrementFolloweesCount(alias: string): Promise<void>;
    decrementFolloweesCount(alias: string): Promise<void>;
    decrementFollowersCount(alias: string): Promise<void>;

}
export interface AuthtokenDAOInterface{
    putAuth(authObj: AuthTokenObject): Promise<void>;
    deleteToken(authToken: AuthToken): Promise<void>;
    isAuthenticated(authtoken: AuthToken): Promise<boolean | undefined>;
    getAlias(authtoken: AuthToken): Promise<string | undefined>;
}

export interface FeedDAOInterface{
    putFeed(feedObj: FeedObject): Promise<void>;
    getPageOfFeeds(
        lastItem: Status| null,
        limit: number,
        user: User
      ): Promise<DataPage<FeedObject>>;
      createFeedWrite(followsList: string[], timeStamp:number, post:string, author:string):Promise<void>;
}

export interface S3DAOInterface{
    putImage(
        fileName: string,
        imageStringBase64Encoded: string
      ): Promise<string>;
}