import { AuthToken, User, Status, LoadMoreStatusItemsRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class StatusService{
    public async loadMoreStoryItems (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]>  {

        const request = new LoadMoreStatusItemsRequest(authToken, user, pageSize, lastItem);
        const response = await (new ServerFacade().loadMoreStoryItems(request));

        console.log("Story Items: " + response._message + ", "+ response._success);
        return response._items;
      };
    
      public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        
        const request = new LoadMoreStatusItemsRequest(authToken, user, pageSize, lastItem);
        const response = await (new ServerFacade().loadMoreFeedItems(request));

        console.log("Feed Items: " + response._message + ", "+ response._success);
        return response._items;
      };
      public async postStatus(
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void>{
        const request = new PostStatusRequest(authToken, newStatus)
        const response = await (new ServerFacade().postStatus(request));
        console.log("Post Response: "+ response._message + ", "+ response._success);
        // Pause so we can see the logging out message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
      }
}