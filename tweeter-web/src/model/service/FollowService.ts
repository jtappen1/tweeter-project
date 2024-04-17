import { AuthToken, User, FakeData, LoadMoreIemsRequest } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class FollowService{
    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {

        const loadMoreItemsRequest = new LoadMoreIemsRequest(authToken,user,pageSize, lastItem)
        const loadMoreItemsResponse = await (new ServerFacade().loadMoreFollowers(loadMoreItemsRequest));
        console.log("THIS IS A LOAD MORE FOLLOWERS SERVICE CALL");
        return loadMoreItemsResponse._items;
      };
      //FakeData.instance.getPageOfUsers(lastItem, pageSize, user
    
      public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        
        const loadMoreItemsRequest = new LoadMoreIemsRequest(authToken,user,pageSize, lastItem)
        const loadMoreItemsResponse = await (new ServerFacade().loadMoreFollowees(loadMoreItemsRequest));
        
        return loadMoreItemsResponse._items;
      };
      
    
}