import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";

export class GetFollowersCountRequest{
    public _authToken: AuthToken;
    public _user: User;

    constructor(authToken: AuthToken, user: User){
        this._authToken = authToken;
        this._user= user;
    }

    public get authToken(): AuthToken {
        return this._authToken;
    }

    // Getter for _user
    public get user(): User {
        return this._user;
    }
    static fromJson(json: GetFollowersCountRequest): GetFollowersCountRequest {
        interface GetFollowersCountJson {
          _user: JSON;
          _authToken: JSON;
        }
    
        const jsonObject: GetFollowersCountJson =
          json as unknown as GetFollowersCountJson;
        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
        if (deserializedUser === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize user with json:\n" +
              JSON.stringify(jsonObject._user)
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
    
        return new GetFollowersCountRequest(
          deserializedToken,
          deserializedUser
        );
      }

}