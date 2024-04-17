import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";

export class PostStatusRequest{
    public _authToken: AuthToken;
    public _status: Status;

    constructor(authToken: AuthToken, status: Status){
        this._authToken = authToken;
        this._status = status;
    }

    static fromJson(json: PostStatusRequest): PostStatusRequest {
        interface PostStatusRequestJSON {
          _authToken: JSON;
          _status: JSON;
        }
    
        const jsonObject: PostStatusRequestJSON =
          json as unknown as PostStatusRequestJSON;
    
        const deserializedToken = AuthToken.fromJson(
          JSON.stringify(jsonObject._authToken)
        );
    
        if (deserializedToken === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize token with json:\n" +
              JSON.stringify(jsonObject._authToken)
          );
        }
        const deserializedStatus = Status.fromJson(JSON.stringify(jsonObject._status));
        if (deserializedStatus === null) {
            throw new Error(
              "Post Status, could not deserialize Status with json:\n" +
                JSON.stringify(jsonObject._status)
            );
          }
    
        return new PostStatusRequest(
          deserializedToken,
          deserializedStatus
        );
      }
}