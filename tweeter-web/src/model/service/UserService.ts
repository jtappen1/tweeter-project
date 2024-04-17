import { User, AuthToken, FakeData, RegisterRequest, LogOutRequest, GetUserRequest } from "tweeter-shared";
import { Buffer } from "buffer";
import { LoginRequest } from "tweeter-shared/src/model/network_layer/request/LoginRequest";
import { ServerFacade } from "./net/ServerFacade";
import { GetFollowersCountRequest } from "tweeter-shared";
import { GetIsFollowerStatusRequest } from "tweeter-shared";


export class UserService{
    public async login (
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        const loginRequest = new LoginRequest(alias, password);
        const loginResponse  = (await new ServerFacade().login(loginRequest));
        console.log("first user:" + loginResponse.user.firstName)
        let user = User.fromJson(JSON.stringify(loginResponse.user));
        let authToken = AuthToken.fromJson(JSON.stringify(loginResponse.token));
        console.log(user);
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
        if(authToken === null){
          throw new Error("Invalid Authtoken");
        }
        
        return [user, authToken];
       
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
      ): Promise<[User, AuthToken]>{
        
        let imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");

        const registerRequest = new RegisterRequest(firstName, lastName,alias, password, userImageBytes);
        const registerResponse  = (await new ServerFacade().register(registerRequest));

        let user = User.fromJson(JSON.stringify(registerResponse.user));
        let authToken = AuthToken.fromJson(JSON.stringify(registerResponse.token));
        
    
        if (user === null) {
          throw new Error("Invalid registration");
        }
        if(authToken === null){
          throw new Error("Invalid Authtoken");
        }
    
        return [user, authToken];
      };

      public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        
        let getIsFollowerStatusRequest = new GetIsFollowerStatusRequest(authToken, user, selectedUser);
        let getIsFollowerStatusResponse = await (new ServerFacade().getIsFollowerStatus(getIsFollowerStatusRequest))
        console.log("Follower Status:" +getIsFollowerStatusResponse._isFollower)
        return getIsFollowerStatusResponse._isFollower;
        
      };

      public async getFollowersCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        
        const getFollowersCountRequest = new GetFollowersCountRequest(authToken, user)
       
        const getFollowersCountResponse = await (new ServerFacade().getFollowersCount(getFollowersCountRequest));
        if(getFollowersCountResponse._followersCount != undefined){
          return getFollowersCountResponse._followersCount;
        }
        else{
          throw new Error("Followers count was undefined");
        }
       
      };

      public async getFolloweesCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        
        const getFolloweesCountRequest = new GetFollowersCountRequest(authToken, user)
        const getFollowersCountResponse = await (new ServerFacade().getFolloweesCount(getFolloweesCountRequest));
        if(getFollowersCountResponse._followersCount!= undefined){
          return getFollowersCountResponse._followersCount;
        }
        else{
          throw new Error("Followees count was undefined")
        }
      };

      public async logout(authToken: AuthToken): Promise<void> {
        
        await new Promise((res) => setTimeout(res, 1000));
        const logOutRequest = new LogOutRequest(authToken);
        let logOutResponse = await (new ServerFacade().logout(logOutRequest))
        console.log("Logout response: "+ logOutResponse._success + ", " + logOutResponse._message);
      };
      
      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followersCount: number, followeesCount: number]> {
        
        await new Promise((f) => setTimeout(f, 2000));

        const followRequest = new GetFollowersCountRequest(authToken, userToFollow)
        
        const followResponse = await (new ServerFacade().follow(followRequest));
        console.log("Follow Response:" + followResponse._message + ", " + followResponse._success);
        
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
      };
      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followersCount: number, followeesCount: number]> {
        // // Pause so we can see the unfollowing message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
        
        const unfollowRequest = new GetFollowersCountRequest(authToken, userToUnfollow)
        
        const unfollowResponse = await (new ServerFacade().unfollow(unfollowRequest));
        console.log("Unfollow Response:" +unfollowResponse);
    
        let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
      };

      public async getUser(
        authToken: AuthToken,
        alias: string
      ): Promise<User | null>{
        const getUserRequest = new GetUserRequest(authToken, alias);
        const getUserResponse = await (new ServerFacade().getUser(getUserRequest))
        console.log("Get User Response: " + getUserResponse._message + ", "+ getUserResponse._success);
        
        return getUserResponse._user;
      };

}