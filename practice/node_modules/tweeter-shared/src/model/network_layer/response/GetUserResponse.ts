import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class GetUserResponse extends TweeterResponse{
    public _user: User | null;

    public constructor(success: boolean, message:string | null, user: User | null){
        super(success, message);
        this._user = user;
    }

    static fromJson(json: GetUserResponse): GetUserResponse {
        interface GetUserJson extends TweeterResponse {
          _user: JSON;
        }
    
        const jsonObject: GetUserJson =
          json as unknown as GetUserJson;
        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
        if (deserializedUser === null) {
          throw new Error(
            "AuthenticateResponse, could not deserialize user with json:\n" +
              JSON.stringify(jsonObject._user)
          );
        }
    
    
        return new GetUserResponse(
          jsonObject._success,
          jsonObject._message,
          deserializedUser
        );
      }

    


}