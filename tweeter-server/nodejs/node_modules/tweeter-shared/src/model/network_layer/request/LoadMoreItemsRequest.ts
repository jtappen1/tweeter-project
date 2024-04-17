import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { GetFollowersCountRequest } from "./GetFollowersCountRequest";

export class LoadMoreIemsRequest extends GetFollowersCountRequest{
    private _pageSize: number;
    private _lastItem: User | null;
    
    public constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null){
        super(authToken, user);
        this._pageSize = pageSize;
        this._lastItem = lastItem;
    }

    public get pageSize(): number {
        return this._pageSize;
    }

    // Getter for lastItem
    public get lastItem(): User | null {
        return this._lastItem;
    }

    static fromJson(json: LoadMoreIemsRequest): LoadMoreIemsRequest {
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
          deserializedLastItem = User.fromJson(JSON.stringify(jsonObject._lastItem));
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
    
        return new LoadMoreIemsRequest(
            deserializedToken,
            deserializedUser,
            jsonObject._pageSize,
            deserializedLastItem,
        );
      }


}