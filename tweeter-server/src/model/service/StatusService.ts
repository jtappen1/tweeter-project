import { AuthToken, User, Status, FakeData, LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse, PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { FeedDAOInterface, FollowsDAOInterface, IDaoFactory, StoryDAOInterface, UserDAOInterface } from "../../dao/IDaoFactory";
import { StoryObject } from "../../entity/StoryObject";
import { FeedObject } from "../../entity/FeedObject";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";



export class StatusService{
    private _storyDAO: StoryDAOInterface;
    private _userDAO: UserDAOInterface;
    private _feedDao : FeedDAOInterface;
    private _followsDao : FollowsDAOInterface;
    private sqsClient = new SQSClient();
    

    public constructor(factoryDao: IDaoFactory){
      this._storyDAO = factoryDao.getStoryDAO();
      this._userDAO = factoryDao.getUserDao();
      this._feedDao = factoryDao.getFeedDAO();
      this._followsDao = factoryDao.getFollowsDao();
      
  }

    public async loadMoreStoryItems (
        request : LoadMoreStatusItemsRequest
      ): Promise<LoadMoreStatusItemsResponse>  {

        const deserializedRequest = LoadMoreStatusItemsRequest.fromJson(request);
        let storyObjs = await this._storyDAO.getPageOfStories(deserializedRequest._lastItem, deserializedRequest._pageSize, deserializedRequest._user);
        let storyObjArray = storyObjs.values;
        let storyArray : Status[] = [];

        for(let i = 0; i< storyObjArray.length; i++){
          const status  = storyObjArray[i];
          const userOBJ  = await this._userDAO.getUser(status._alias);

          if(userOBJ == null){
            throw new Error("USER IS NULL IN LOAD MORE STORY ITEMS");
          }
          storyArray.push(new Status(status._post, new User(userOBJ._firstName, userOBJ._lastName, userOBJ._alias, userOBJ._url), status._timeStamp));
        }
        
        // if(deserializedRequest._user != null){
        //   return new LoadMoreStatusItemsResponse(true, FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize), "Successfully loaded Story Items")
        // }
        return new LoadMoreStatusItemsResponse(true, [storyArray, storyObjs.hasMorePages], "Successfully loaded Story Items")

      };
    
      public async loadMoreFeedItems(
        request : LoadMoreStatusItemsRequest
      ): Promise<LoadMoreStatusItemsResponse> {
        // TODO: Replace with the result of calling server
        const deserializedRequest = LoadMoreStatusItemsRequest.fromJson(request);

        let feedObjects = await this._feedDao.getPageOfFeeds(deserializedRequest._lastItem, deserializedRequest._pageSize, deserializedRequest._user);
        let feedObjArray = feedObjects.values;
        let feedArray : Status[] = [];

        for(let i = 0; i< feedObjArray.length; i++){
          const status  = feedObjArray[i];
          const userOBJ  = await this._userDAO.getUser(status._postAuthor);
          if(userOBJ == null){
            throw new Error("USER IS NULL IN LOAD MORE STORY ITEMS");
          }
          feedArray.push(new Status(status._post, new User(userOBJ._firstName, userOBJ._lastName, userOBJ._alias, userOBJ._url), status._timeStamp));
        }

        // if(deserializedRequest._user != null){
        //   return new LoadMoreStatusItemsResponse(true, FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize), "Successfully loaded Story Items")
        // }
        //FakeData.instance.getPageOfStatuses(deserializedRequest._lastItem, deserializedRequest._pageSize)
        return new LoadMoreStatusItemsResponse(true,[feedArray, feedObjects.hasMorePages] , "Successfully loaded Story Items")
      };
      public async postStatus(
        postStatusRequest: PostStatusRequest
      ): Promise<TweeterResponse>{
        // Pause so we can see the logging out message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
        const request = PostStatusRequest.fromJson(postStatusRequest);
        await this._storyDAO.putStory(new StoryObject(request._status.user.alias, request._status.timestamp, request._status.post))

        const userPost = request._status.post;
        const alias = request._status.user.alias;
        await this.sendMessage(userPost,alias, request._status.timestamp);

        // const followersArray = await this._followsDao.getPageOfFollowers(null, 10, request._status.user);
        // console.log("Followers Array : "+ followersArray.values);
        // for(let i = 0; i < followersArray.values.length; i++){
        //   const follow = followersArray.values[i];
        //   const followAlias = follow._followee_handle;
        //   console.log("This is the followee handle" +followAlias);
        //   await this._feedDao.putFeed(new FeedObject(followAlias, request._status.timestamp, request._status.post, request._status.user.alias));
        // }
        
        if (request._authToken != null){
          return new TweeterResponse(true, "Successfully Posted Status");
        }
        else{
          return new TweeterResponse(false, "Did not Successfully Post Status");
        }
      }
    public async getFollowers(alias: string, timeStamp:string, post:string):Promise<string>{
      console.log("Got into GetFollowers" + alias);
      let userObj = await this._userDAO.getUser(alias);
      console.log("UserOBJ:" + userObj);
      if(userObj == null){
        throw new Error("user was null in get followers");
      }
      let user = new User(userObj?._firstName, userObj?._lastName, userObj?._alias, userObj?._url);

      console.log("User: "+ user);
      
      let hasMorePages = true;
      // let followersArray = await this._followsDao.getPageOfFollowers(null, 200, user);
      let count  = 0;
      let lastItem: User  | null = null;

      while(hasMorePages){
        
        // if(count === 22){
        //   break;
        // }
        count++;

        let followersArray = await this._followsDao.getPageOfFollowers(lastItem, 1000, user);
        
        console.log("THIS IS HAS MORE PAGES: " + hasMorePages);
        console.log("Followers Array : "+ followersArray.values);
        let comma  = "";
        let finalString = "";
        
        
        for(let i = 0; i < followersArray.values.length; i++){
          const follow = followersArray.values[i];
          const followAlias = follow._follower_handle;
          finalString = finalString + comma + followAlias;
          comma = ",";

          if(i === followersArray.values.length-1){
            userObj = await this._userDAO.getUser(followersArray.values[i]._follower_handle);
            if(userObj == null){
              throw new Error("user was null in get followers");
            }
            lastItem = new User(userObj?._firstName, userObj?._lastName, userObj?._alias, userObj?._url);
            console.log("Got last user: " +lastItem?.alias);
          }
          // await this._feedDao.putFeed(new FeedObject(followAlias, request._status.timestamp, request._status.post, request._status.user.alias));
        }
        finalString= finalString + comma+timeStamp+comma+post+comma+alias
        console.log("BATCH :" + count)
        await this.sendMessageToFeedQueue(finalString);
        hasMorePages = followersArray.hasMorePages;
        if(hasMorePages === false){
          break;
        }
      }
      return "Finished GetFollowers"
    }
      

    public async sendMessage(post: string, alias: string, timeStamp:number): Promise<void> {
    const sqs_url = "https://sqs.us-east-2.amazonaws.com/153357736288/StatusQueue";

    const params = {
      DelaySeconds: 10,
      MessageBody: post + "Alias:" + alias + "Timestamp:" + timeStamp + "Post:" + post, 
      QueueUrl: sqs_url,
    };
    console.log("Initial send message" + params.MessageBody)

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
  public async sendMessageToFeedQueue(followerList: string): Promise<void> {
    const sqs_url = "https://sqs.us-east-2.amazonaws.com/153357736288/FeedQueue";

    const params = {
      DelaySeconds: 10,
      MessageBody: followerList,
      QueueUrl: sqs_url,
    };
    console.log("In SendMessageToFeedQueue");

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
  public async writeToFeedTable(followsList: string[],timeStamp:number, post:string, author:string){
    let followLength =followsList.length;
    // console.log("FollowsLength: "+ followLength);
    while(followLength > 25){
      const shortenedList = followsList.splice(0,25);
      if(shortenedList == null || shortenedList == undefined){
        console.log("Shortened List UNDEFINED");
      }
      // console.log("Shortened List:" + shortenedList)
      await this._feedDao.createFeedWrite(shortenedList, timeStamp, post, author);
      followLength -= 25;
    }
    // console.log("FINAL FOLLOWS LIST LENGTH:" +followsList.length)
    await this._feedDao.createFeedWrite(followsList, timeStamp, post, author);
    console.log("ADDED " + followLength + " feed items");
    
  }

}