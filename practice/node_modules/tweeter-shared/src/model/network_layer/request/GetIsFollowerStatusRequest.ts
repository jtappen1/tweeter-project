import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { GetFollowersCountRequest } from "./GetFollowersCountRequest";

export class GetIsFollowerStatusRequest extends GetFollowersCountRequest{
    public _selectedUser: User;
    

    constructor(authToken: AuthToken, user: User, selectedUser: User){
        super(authToken, user)
        this._selectedUser= selectedUser;
        
    }

    public get selectedUser(){
        return this._selectedUser;
    }

    static fromJson(json: GetIsFollowerStatusRequest): GetIsFollowerStatusRequest {
        interface GetIsFollowerCountJson {
          _selectedUser: JSON;
          _authToken : JSON;
          _user : JSON
        }
    
        const jsonObject: GetIsFollowerCountJson =
          json as unknown as GetIsFollowerCountJson;
        const deserializedSelectedUser = User.fromJson(JSON.stringify(jsonObject._selectedUser));

        if(deserializedSelectedUser === null){
            throw new Error("selected User was null");
        }

        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
        if (deserializedUser === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize user with json:\n" +
              JSON.stringify(jsonObject._selectedUser)
          );
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
        console.log(deserializedUser.firstName + " " + deserializedToken.token);
    
        return new GetIsFollowerStatusRequest(
          deserializedToken,
          deserializedUser,
          deserializedSelectedUser
        );
      }

}