import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { GetFolloweesCountRequest } from "../request/GetFolloweesCountRequest";
import { GetFolloweesCountResponse } from "./GetFolloweesCountResponse";
import { TweeterResponse } from "./TweeterResponse";

export class GetFollowersCountResponse extends TweeterResponse{
    public _followersCount: number | undefined;

    public constructor(success: boolean, followersCount: number | undefined, message:string){
        super(success, message);
        this._followersCount = followersCount;

    }

    get followersCount(){
        return this._followersCount;
    }
    // public static fromJson(json: any): [User, AuthToken] {

    //     interface GetFollowersCountResponseJson extends TweeterResponse {
    //         _user: JSON;
    //         _token: JSON;
    //       }
      
    //       const jsonObject: GetFollowersCountResponseJson =
    //         json as unknown as GetFollowersCountResponseJson;
    //       const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    //       const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._token))

    //       if(deserializedUser != null && deserializedToken != null){
    //         return [deserializedUser, deserializedToken];
    //       }
    //       else{
    //         throw new Error("Getting the User and Auth from the String did not work");
    //       }
        
    // }


    // static fromJson(json: GetFolloweesCountRequest): GetFollowersCountResponse {
    //   interface GetFollowersCountJson extends TweeterResponse {
    //     _user: JSON;
    //     _token: JSON;
    //   }
  
    //   const jsonObject: GetFollowersCountJson =
    //     json as unknown as GetFollowersCountJson;
    //   const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
  
    //   if (deserializedUser === null) {
    //     throw new Error(
    //       "AuthenticateResponse, could not deserialize user with json:\n" +
    //         JSON.stringify(jsonObject._user)
    //     );
    //   }
  
    //   const deserializedToken = AuthToken.fromJson(
    //     JSON.stringify(jsonObject._token)
    //   );
  
    //   if (deserializedToken === null) {
    //     throw new Error(
    //       "AuthenticateResponse, could not deserialize token with json:\n" +
    //         JSON.stringify(jsonObject._token)
    //     );
    //   }
    //   console.log(deserializedUser.firstName + " " + deserializedToken.token);
  
    //   return new GetFollowersCountResponse(
    //     jsonObject.success,
    //     deserializedUser,
    //     deserializedToken,
    //     jsonObject.message
    //   );
    // }

    // static fromJson(json: JSON): GetFollowersCountResponse {
    //     interface FollowResponseJson extends TweeterResponse {
    //       _followersCount: JSON;
    //     }
    
    //     const jsonObject: FollowResponseJson =
    //       json as unknown as FollowResponseJson;

          
    //     const deserializedFollowersCount = (JSON.stringify(jsonObject._followersCount));

    //     const jsonObject: FollowResponseJson =
    //       json as unknown as FollowResponseJson;
    //     const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
    // //     // if (deserializedUser === null) {
    // //     //   throw new Error(
    // //     //     "AuthenticateResponse, could not deserialize user with json:\n" +
    // //     //       JSON.stringify(jsonObject._user)
    // //     //   );
    // //     // }
    
    // //     // const deserializedToken = AuthToken.fromJson(
    // //     //   JSON.stringify(jsonObject._token)
    // //     // );
    
    // //     // if (deserializedToken === null) {
    // //     //   throw new Error(
    // //     //     "AuthenticateResponse, could not deserialize token with json:\n" +
    // //     //       JSON.stringify(jsonObject._token)
    // //     //   );
    // //     // }
    // //     // console.log(deserializedUser.firstName + " " + deserializedToken.token);
    
    //     return new GetFollowersCountResponse(
    //       jsonObject.success,
    //       deserializedToken,
    //       jsonObject.message
    //     );
    //   }
}