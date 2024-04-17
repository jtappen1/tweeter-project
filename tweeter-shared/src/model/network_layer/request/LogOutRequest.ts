import { AuthToken } from "../../domain/AuthToken";
export class LogOutRequest{
    public _authToken: AuthToken;

    constructor(authToken: AuthToken){
        this._authToken = authToken;
    }

    static fromJson(json: LogOutRequest): LogOutRequest {
        interface GetFollowersCountJson {
          _authToken: JSON;
        }
    
        const jsonObject: GetFollowersCountJson =
          json as unknown as GetFollowersCountJson;
    
        const deserializedToken = AuthToken.fromJson(
          JSON.stringify(jsonObject._authToken)
        );
    
        if (deserializedToken === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize token with json:\n" +
              JSON.stringify(jsonObject._authToken)
          );
        }
    
        return new LogOutRequest(
          deserializedToken,
        );
      }
}