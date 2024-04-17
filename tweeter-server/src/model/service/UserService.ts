import { AuthToken, AuthenticateResponse, FakeData, LoginRequest, RegisterRequest, User, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusResponse, TweeterResponse, LogOutRequest, GetUserRequest, GetUserResponse, GetIsFollowerStatusRequest } from "tweeter-shared";
import { AuthtokenDAOInterface, FollowsDAOInterface, IDaoFactory, S3DAOInterface, UserDAOInterface } from "../../dao/IDaoFactory";
import { follows } from "../../entity/Follower";
import { UserDAO } from "../../dao/UserDAO";
import { UserObject } from "../../entity/UserObject";
import { AuthTokenObject } from "../../entity/AuthtokenObject";
import { SHA256, enc } from "crypto-js";




export class UserService{

  private _followDao: FollowsDAOInterface;
  private _userDao: UserDAOInterface;
  private _authtokenDao: AuthtokenDAOInterface;
  private _s3Dao: S3DAOInterface;

  public constructor(factoryDao: IDaoFactory){
      this._followDao = factoryDao.getFollowsDao();
      this._userDao = factoryDao.getUserDao();
      this._authtokenDao = factoryDao.getAuthTokenDAO();
      this._s3Dao = factoryDao.getS3DAO();
      
  }

    public async login (
        loginRequest: LoginRequest
      ): Promise<AuthenticateResponse> {
        // TODO: Replace with the result of calling the server
        // const loginRequest = new LoginRequest(alias, password);
        // const loginResponse  = (await new ServerFacade().login(loginRequest));
        // let user = User.fromJson(JSON.stringify(loginResponse.user));
        // let authToken = AuthToken.fromJson(JSON.stringify(loginResponse.token));
        // console.log(user);
        
          
        // let user = FakeData.instance.firstUser;
        // let authToken = FakeData.instance.authToken

        const authtoken = AuthToken.Generate();
      
        await this._authtokenDao.putAuth(new AuthTokenObject(authtoken.token, authtoken.timestamp, loginRequest._alias))
        console.log("added to the auth table")

        let userObject = await this._userDao.getUser(loginRequest._alias);

        if (userObject === null) {
          throw new Error("[Bad Request] requested user does not exist")
        }
        let hashedPassword = SHA256(loginRequest._password);

        if( hashedPassword.toString(enc.Base64) !== userObject?._password){
          throw new Error("Password not correct");
        }

        let user = new User(userObject._firstName, userObject._lastName,userObject._alias, userObject._url);
        console.log("This is the user:" + user);

        if(authtoken === null){
          throw new Error("[AuthError] unauthenticated request");
        }
        if(user != null){
            console.log("This is the user:" + user)
            return new AuthenticateResponse(true, user, authtoken, "login success");
        }
        else{
            throw new Error("Invalid Login");
        }
        //FakeData.instance.authToken
        //Make login request
        //Send it to the server facade
      };
    // public returnUserService(): {
    //     return new UserService();
    // }

    public async register (
        registerRequest: RegisterRequest
      ): Promise<AuthenticateResponse>{
        // Not neded now, but will be needed when you make the request to the server in milestone 3

        let imageStringBase64: string =
          Buffer.from(registerRequest._userImageBytes).toString("base64");
        
        const authtoken = AuthToken.Generate();
      
        await this._authtokenDao.putAuth(new AuthTokenObject(authtoken.token, authtoken.timestamp, registerRequest._alias))
        console.log("added to the auth table")
        
        const url = await this._s3Dao.putImage(registerRequest._alias, imageStringBase64);

        let hashedPassword = SHA256(registerRequest._password);

        await this._userDao.putUser(new UserObject(registerRequest._alias, url, registerRequest._firstName, registerRequest._lastName, hashedPassword.toString(enc.Base64), 0, 0));
        console.log("added to the user table")

    
        // TODO: Replace with the result of calling the server
        // let user = FakeData.instance.firstUser;

        let user = new User(registerRequest._firstName, registerRequest._lastName, registerRequest._alias, imageStringBase64);
    
        if (user === null) {
          throw new Error("[Bad Request] requested user does not exist")
        }
        if(authtoken === null){
          throw new Error("[AuthError] unauthenticated request");
        }
        if(user != null){
            return new AuthenticateResponse(true, user, authtoken, "register success");
        }
        else{
            throw new Error("Invalid Login");
        }
      };

      public async getFollowersCount (getFollowersCountRequest : GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
        
        const deserializedRequest = GetFollowersCountRequest.fromJson(getFollowersCountRequest);
        console.log("Deserialized Request:" + deserializedRequest)
        console.log("Deserialized alias:" + deserializedRequest._user.alias);

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");

        }
        else{
          if (deserializedRequest._user === null) {
            throw new Error("[Bad Request] requested user does not exist")
          }
          else{
            let userObject = await this._userDao.getUser(deserializedRequest._user.alias);
            if(userObject?._followerCount == undefined){
              return new GetFollowersCountResponse(true, 0, "Get Followers Count Success!")
            }
            return new GetFollowersCountResponse(true, userObject?._followerCount, "Get Followers Count Success!")
          }
          
        }
        
      };

      public async getFolloweesCount (
       getFollowersCountRequest : GetFollowersCountRequest
      ): Promise<GetFollowersCountResponse> {
        // TODO: Replace with the result of calling server
        const deserializedRequest = GetFollowersCountRequest.fromJson(getFollowersCountRequest);
        console.log("Deserialized Request:" + deserializedRequest)
        console.log("Deserialized Request:" + deserializedRequest._user);

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");
        }
        else{
        
          if (deserializedRequest._user === null) {
            console.log(deserializedRequest._user)
            throw new Error("[Bad Request] requested user does not exist")
          }
          else{
            let userObject = await this._userDao.getUser(deserializedRequest._user.alias);
            if(userObject?._followeeCount == undefined){
              return new GetFollowersCountResponse(true, 0, "Get Followers Count Success!")
            }
            return new GetFollowersCountResponse(true, userObject?._followeeCount, "Get Followees Count Success!")
          }
        }

        // if (deserializedRequest._user === null) {
        //   throw new Error("[Bad Request] requested user does not exist")
        // }
        // if(deserializedRequest._authToken === null){
        //   throw new Error("[AuthError] unauthenticated request");
        // }
        // else{
        //   return new GetFollowersCountResponse(true, FakeData.instance.getFolloweesCount(deserializedRequest.user), "Get Followees Count Success!")
        // }
        
      };


      public async follow (
        followRequest: GetFollowersCountRequest
      ): Promise<TweeterResponse> {
        // Pause so we can see the following message. Remove when connected to the server
        // await new Promise((f) => setTimeout(f, 2000));
        const deserializedRequest = GetFollowersCountRequest.fromJson(followRequest);

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");
        }
        else{
          const alias = await this._authtokenDao.getAlias(deserializedRequest._authToken);
          if(alias == undefined){
            throw new Error("Alias is undefined");
          }
          const user = await this._userDao.getUser(alias);
          if(user == undefined){
            throw new Error("user is Undefined");
          }
          const followsOBJ = new follows( alias, deserializedRequest._user.alias, user?._firstName, deserializedRequest._user.firstName);
          await this._followDao.putFollows(followsOBJ);
          console.log("Successfully added to the Follows Table");

          await this._userDao.incrementFolloweesCount(alias);
          await this._userDao.incrementFollowersCount(deserializedRequest._user.alias);

          console.log("successfully added to the counts");
          
          return new TweeterResponse(true, "successfully followed");
        }
    
        // TODO: Call the server
        // let getFollowersFolloweesCountRequest = new GetFollowersCountRequest(deserializedRequest._authToken, deserializedRequest._user);

        // let followersCount = await this.getFollowersCount(getFollowersFolloweesCountRequest);
        // let followeesCount = await this.getFolloweesCount(getFollowersFolloweesCountRequest);
        
        // await this._followDao.putFollows(followsOBJ);
        // console.log("Successfully added to the Follows Table");

        // if(followeesCount != null && followersCount != null){
        //   return new TweeterResponse(true, "successfully followed");
        // }
        // else{
        //   return new TweeterResponse(false, "Did not successfully follow");
        // }
      };

      public async unfollow (
        unfollowRequest: GetFollowersCountRequest
      ): Promise<TweeterResponse> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        const deserializedRequest = GetFollowersCountRequest.fromJson(unfollowRequest);

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");
        }
        else{
          const alias = await this._authtokenDao.getAlias(deserializedRequest._authToken);
          if(alias == undefined){
            throw new Error("Alias is undefined");
          }
          const user = await this._userDao.getUser(alias);
          if(user == undefined){
            throw new Error("user is Undefined");
          }
          const unfollowOBJ = new follows(alias, deserializedRequest._user.alias, user?._firstName, deserializedRequest._user.firstName);
          await this._followDao.deleteFollows(unfollowOBJ);
          console.log("Successfully added to the Follows Table");

          await this._userDao.decrementFolloweesCount(alias);
          await this._userDao.decrementFollowersCount(deserializedRequest._user.alias);

          console.log("successfully added to the counts");
          
          return new TweeterResponse(true, "successfully followed");
        }

        // await new Promise((f) => setTimeout(f, 2000));
        // const deserializedRequest = GetFollowersCountRequest.fromJson(unfollowRequest);
    
        // // TODO: Call the server
        // let getFollowersFolloweesCountRequest = new GetFollowersCountRequest(deserializedRequest._authToken, deserializedRequest._user);

        // let followersCount = await this.getFollowersCount(getFollowersFolloweesCountRequest);
        // let followeesCount = await this.getFolloweesCount(getFollowersFolloweesCountRequest);
        // if(followeesCount != null && followersCount != null){
        //   return new TweeterResponse(true, "successfully unfollowed");
        // }
        // else{
        //   return new TweeterResponse(false, "Did not successfully unfollow");
        // }
        
      };

      public async getIsFollowerStatus (
        getIsFollowerStatusRequest: GetIsFollowerStatusRequest
      ): Promise<GetIsFollowerStatusResponse> {
        const deserializedRequest = GetIsFollowerStatusRequest.fromJson(getIsFollowerStatusRequest);
        console.log("Deserialized SelectedUser Alias: " + deserializedRequest._selectedUser.alias)
        

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");
        }
        else{
          const alias = await this._authtokenDao.getAlias(deserializedRequest._authToken);
          if(alias == undefined){
            throw new Error("Alias is undefined");
          }
          const user = await this._userDao.getUser(alias);
          if(user == undefined){
            throw new Error("user is Undefined");
          }
          console.log("User Alias: " + user._alias)
          console.log("User firstName: " + user._firstName);
          console.log("User lastname: " + user._lastName);
          console.log("User password: " + user._password);
          console.log("User url: " + user._url);
          console.log("user Followe: r" + user._followerCount);
          console.log("user followee: " + user._followeeCount);

          const isFollowerOBJ = new follows(deserializedRequest._user.alias, deserializedRequest.selectedUser.alias, deserializedRequest._user.firstName, deserializedRequest._selectedUser.firstName);
          const isFollower = await this._followDao.getFollowing(isFollowerOBJ);
          if(isFollower == undefined){
            throw new Error("isFollower is undefinded when its not supposed to be");
            
          }
          return new GetIsFollowerStatusResponse(true, isFollower, "Successfully got throught getIsFollowerStatus");
        }
        


        // if(deserializedRequest._user == null){
        //   throw new Error("[Bad Request] requested user does not exist")
        // }
        // if(deserializedRequest._authToken == null){
        //   throw new Error("[AuthError] unauthenticated request");
        // }
        // else{
        //   return new GetIsFollowerStatusResponse(true, FakeData.instance.isFollower(), "Successfully got throught getIsFollowerStatus");
        // }
        
        
      };
      public async logout(logOutRequest: LogOutRequest): Promise<TweeterResponse> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        // await new Promise((res) => setTimeout(res, 1000));
        const deserializedRequest = LogOutRequest.fromJson(logOutRequest);

        console.log("Service token:"+ deserializedRequest._authToken.token);

        await this._authtokenDao.deleteToken(deserializedRequest._authToken);

        if(deserializedRequest._authToken != null){
          return new TweeterResponse(true, "Successfully logged out");
        }
        else{
          throw new Error("[AuthError] unauthenticated request");
        }
      };

      public async getUser(
        getUserRequest : GetUserRequest
      ): Promise<GetUserResponse>{
        console.log("Starting to getUser");
        const deserializedRequest = GetUserRequest.fromJson(getUserRequest);

        if(!await this._authtokenDao.isAuthenticated(deserializedRequest._authToken)){
          throw new Error("[AuthError] unauthenticated request");
        }
        else{
          console.log("Get User Alias: " + deserializedRequest._alias);
          const userObj = await this._userDao.getUser(deserializedRequest._alias);
          if(userObj == undefined){
            throw new Error("UserObj undefined");
          }
          const user = new User(userObj?._firstName,userObj?._lastName, userObj?._alias, userObj?._url);
          return new GetUserResponse(true, "Successfully got a User",user);
        }
        

        // if(deserializedRequest._alias != null){
        //   return new GetUserResponse(true, "Successfully got a User",FakeData.instance.findUserByAlias(deserializedRequest._alias) );
        // }
        // else{
        //   throw new Error("[AuthError] unauthenticated request");
        // }

    };
}