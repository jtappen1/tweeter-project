import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";
import { AuthToken } from "../../domain/AuthToken";



export class AuthenticateResponse extends TweeterResponse {
    public _user: User;
    public _token: AuthToken;
  
    constructor(
      success: boolean,
      user: User,
      token: AuthToken,
      message: string | null = null
    ) {
      super(success, message);
      this._user = user;
      this._token = token;
    }
  
    get user() {
      return this._user;
    }
  
    get token() {
      return this._token;
    }
  
    static fromJson(json: AuthenticateResponse): AuthenticateResponse {
      interface AuthenticateResponseJson extends TweeterResponse {
        _user: JSON;
        _token: JSON;
      }
  
      const jsonObject: AuthenticateResponseJson =
        json as unknown as AuthenticateResponseJson;
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
  
      if (deserializedUser === null) {
        throw new Error(
          "AuthenticateResponse, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
        );
      }
  
      const deserializedToken = AuthToken.fromJson(
        JSON.stringify(jsonObject._token)
      );
  
      if (deserializedToken === null) {
        throw new Error(
          "AuthenticateResponse, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._token)
        );
      }
      console.log(deserializedUser.firstName + " " + deserializedToken.token);
  
      return new AuthenticateResponse(
        jsonObject.success,
        deserializedUser,
        deserializedToken,
        jsonObject.message
      );
    }
  }