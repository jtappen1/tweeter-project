import { TweeterResponse } from "./TweeterResponse";

export class GetFolloweesCountResponse extends TweeterResponse{
    private _followeesCount: number | PromiseLike<number>;
    

    public constructor(success: boolean, followeesCount: number | PromiseLike<number>, message:string){
        super(success, message);
        this._followeesCount = followeesCount;

    }

    get followeesCount(){
        return this._followeesCount;
    }

    // get followeesCount(){
    //     return this._followeesCount;
    // }
    // static fromJson(json: JSON): FollowResponse {
    //     interface FollowResponseJson extends TweeterResponse {
    //       // _followersCount: JSON;
    //     }
    
    //     const jsonObject: FollowResponseJson =
    //       json as unknown as FollowResponseJson;
    //     // const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
    //     // if (deserializedUser === null) {
    //     //   throw new Error(
    //     //     "AuthenticateResponse, could not deserialize user with json:\n" +
    //     //       JSON.stringify(jsonObject._user)
    //     //   );
    //     // }
    
    //     // const deserializedToken = AuthToken.fromJson(
    //     //   JSON.stringify(jsonObject._token)
    //     // );
    
    //     // if (deserializedToken === null) {
    //     //   throw new Error(
    //     //     "AuthenticateResponse, could not deserialize token with json:\n" +
    //     //       JSON.stringify(jsonObject._token)
    //     //   );
    //     // }
    //     // console.log(deserializedUser.firstName + " " + deserializedToken.token);
    
    //     return new AuthenticateResponse(
    //       jsonObject.success,
    //       f
    //       deserializedToken,
    //       jsonObject.message
    //     );
    //   }
}