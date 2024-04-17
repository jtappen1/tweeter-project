import { AuthToken } from "../../domain/AuthToken";
export class GetUserRequest{
    public _authToken: AuthToken;
    public _alias: string;

    constructor(authToken: AuthToken, alias: string){
        this._authToken = authToken;
        this._alias = alias

    }

    static fromJson(json: GetUserRequest): GetUserRequest {
        interface GetUserRequestJson{
          _authToken: JSON;
          _alias: string;
        }
    
        const jsonObject: GetUserRequestJson =
          json as unknown as GetUserRequestJson;
    
        const deserializedToken = AuthToken.fromJson(
          JSON.stringify(jsonObject._authToken)
        );
    
        if (deserializedToken === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize token with json:\n" +
              JSON.stringify(jsonObject._authToken)
          );
        }
    
        return new GetUserRequest(
          deserializedToken,
          jsonObject._alias
        );
      }
}