import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { GetFollowersCountRequest } from "./GetFollowersCountRequest";

export class LoadMoreStatusItemsRequest extends GetFollowersCountRequest{
    public _pageSize: number;
    public _lastItem: Status | null;
    
    public constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null){
        super(authToken, user);
        this._pageSize = pageSize;
        this._lastItem = lastItem;
    }

    

    static fromJson(json: LoadMoreStatusItemsRequest): LoadMoreStatusItemsRequest {
        interface LoadMoreItemsJson{
          _user: JSON;
          _authToken:JSON,
          _pageSize: number
          _lastItem: JSON
        }
    
        const jsonObject: LoadMoreItemsJson =
          json as unknown as LoadMoreItemsJson;
        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
        if (deserializedUser === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize user with json:\n" +
              JSON.stringify(jsonObject._user)
          );
        }
        let deserializedLastItem;
        if(jsonObject._lastItem == null){
          deserializedLastItem = null;
        }
        else{
          deserializedLastItem = Status.fromJson(JSON.stringify(jsonObject._lastItem));
          if (deserializedLastItem === null) {
            throw new Error(
              "LoadMoreItems, could not deserialize lastItem with json:\n" +
                JSON.stringify(jsonObject._lastItem)
            );
          }

        }

        
    
        const deserializedToken = AuthToken.fromJson(
          JSON.stringify(jsonObject._authToken)
        );
    
        if (deserializedToken === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize token with json:\n" +
              JSON.stringify(jsonObject._authToken)
          );
        }
        // console.log(deserializedUser.firstName + " " + deserializedToken.token);
    
        return new LoadMoreStatusItemsRequest(
            deserializedToken,
            deserializedUser,
            jsonObject._pageSize,
            deserializedLastItem,
        );
      }


}