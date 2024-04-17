import { AuthToken, FakeData, LoadMoreIemsRequest, LoadMoreItemsResponse, User } from "tweeter-shared";
import { FollowsDAOInterface, IDaoFactory, UserDAOInterface } from "../../dao/IDaoFactory";
import { follows } from "../../entity/Follower";

export class FollowService{
  private _followDao: FollowsDAOInterface;
  private _userDao: UserDAOInterface;
  public constructor(factoryDao: IDaoFactory){
      this._followDao = factoryDao.getFollowsDao();
      this._userDao = factoryDao.getUserDao();
  }

    public async loadMoreFollowers(
        // authToken: AuthToken,
        // user: User,
        // pageSize: number,
        // lastItem: User | null
        loadMoreItemsRequest: LoadMoreIemsRequest
      ): Promise<LoadMoreItemsResponse> {
        // const loadMoreItemsRequest = new LoadMoreIemsRequest(authToken,user,pageSize, lastItem)
        // const loadMoreItemsResponse = await (new ServerFacade().loadMoreFollowers(loadMoreItemsRequest));
        // TODO: Replace with the result of calling server
        // console.log(loadMoreItemsRequest);
        const request = LoadMoreIemsRequest.fromJson(loadMoreItemsRequest);
        console.log("User: " + request._user),
        console.log("LastItem: "+ request.lastItem);
        console.log("PageSize:" + request.pageSize);

        let followArray = await this._followDao.getPageOfFollowers(request.lastItem, request.pageSize, request._user);
        let userArray: User[] = []
        for( let i =0; i < followArray.values.length; i++){
            let follow = followArray.values[i];
            console.log("follower handle: " +follow._follower_handle)
            const userOBJ = await this._userDao.getUser(follow._follower_handle);
            if(userOBJ == null){
              throw new Error("Userobj null in follow array");
            }
            userArray.push(new User(userOBJ?._firstName, userOBJ?._lastName, userOBJ?._alias, userOBJ?._url) )
        }
        // FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize,   request.user)

        
        console.log("This is the follows: "+ followArray.values);
        console.log("this is has more pages: " + followArray.hasMorePages);
        // for(let i =0; i<follows; i++){
          
        // }
        // let response =  
        let response = new LoadMoreItemsResponse(true, [userArray, followArray.hasMorePages], "sucessfully loaded more followers")
        return response;
      };
      //FakeData.instance.getPageOfUsers(lastItem, pageSize, user
    
      public async loadMoreFollowees(
        // authToken: AuthToken,
        // user: User,
        // pageSize: number,
        // lastItem: User | null
        loadMoreItemsRequest: LoadMoreIemsRequest
      ): Promise<LoadMoreItemsResponse> {
        // TODO: Replace with the result of calling server
        const request = LoadMoreIemsRequest.fromJson(loadMoreItemsRequest);

        let  followArray = await this._followDao.getPageOfFollowees(request.lastItem, request.pageSize, request._user);
        console.log("This is the follows: "+ followArray.values);
        console.log("this is has more pages: " + followArray.hasMorePages);

        let userArray: User[] = []
        for( let i =0; i < followArray.values.length; i++){
            let follow = followArray.values[i];
            console.log("follower handle: " +follow._followee_handle)
            const userOBJ = await this._userDao.getUser(follow._followee_handle);
            if(userOBJ == null){
              throw new Error("Userobj null in follow array");
            }
            userArray.push(new User(userOBJ?._firstName, userOBJ?._lastName, userOBJ?._alias, userOBJ?._url) )
        }
        let response = new LoadMoreItemsResponse(true, [userArray, followArray.hasMorePages], "sucessfully loaded more followees");
        return response;
      };
      
    
}