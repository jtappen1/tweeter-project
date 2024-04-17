import { AuthenticateResponse, LoadMoreStatusItemsResponse, GetIsFollowerStatusResponse,GetIsFollowerStatusRequest, LoadMoreIemsRequest, LoadMoreItemsResponse, TweeterResponse, User, LogOutRequest, GetUserRequest, GetUserResponse, LoadMoreStatusItemsRequest, PostStatusRequest } from "tweeter-shared";
import { LoginRequest } from "tweeter-shared/src/model/network_layer/request/LoginRequest";
import { ClientCommunicator } from "./ClientCommunicator";
import { RegisterRequest, GetFollowersCountRequest, GetFollowersCountResponse} from "tweeter-shared"

// import { GetFollowersCountRequest } from "tweeter-shared/src/model/network_layer/request/GetFollowersCountRequest";
// import { GetFollowersCountResponse } from "tweeter-shared/src/model/network_layer/response/GetFollowersCountResponse";

export class ServerFacade {

  private SERVER_URL = "https://f51y5hckd9.execute-api.us-east-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/login";
    const response = await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint);
    console.log(response);

    return AuthenticateResponse.fromJson(response);
  }
  async register(request: RegisterRequest) : Promise<AuthenticateResponse>{
    const endpoint = "/register";
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    
    console.log(response);
    return AuthenticateResponse.fromJson(response);
  }
  async getFollowersCount(request: GetFollowersCountRequest) : Promise<GetFollowersCountResponse>{
    const endpoint = "/getFollowerCount";
    console.log(request.user.alias);

    return await this.clientCommunicator.doPost<GetFollowersCountRequest, GetFollowersCountResponse>(request, endpoint);
    // const response: JSON = await this.clientCommunicator.doPost<GetFollowersCountRequest>(request, endpoint);

    // return GetFollowersCountResponse.fromJson(response);
  }
  async getFolloweesCount(request: GetFollowersCountRequest) : Promise<GetFollowersCountResponse>{
    const endpoint = "/getFolloweeCount";
    console.log(request.user.alias);

    return await this.clientCommunicator.doPost<GetFollowersCountRequest, GetFollowersCountResponse>(request, endpoint);
    // const response: JSON = await this.clientCommunicator.doPost<GetFollowersCountRequest>(request, endpoint);

    // return GetFollowersCountResponse.fromJson(response);
  }
  async getIsFollowerStatus(request: GetIsFollowerStatusRequest) : Promise<GetIsFollowerStatusResponse>{
    const endpoint = "/getIsFollowerStatus";
    return await this.clientCommunicator.doPost<GetIsFollowerStatusRequest, GetIsFollowerStatusResponse>(request, endpoint);
  }
  async loadMoreFollowers(request: LoadMoreIemsRequest): Promise<LoadMoreItemsResponse>{
    const endpoint  ="/loadMoreFollowers";
    const response =  await this.clientCommunicator.doPost<LoadMoreIemsRequest, LoadMoreItemsResponse>(request, endpoint);
    return LoadMoreItemsResponse.fromJson(response);
  }
  async loadMoreFollowees(request: LoadMoreIemsRequest): Promise<LoadMoreItemsResponse>{
    const endpoint  ="/loadMoreFollowees";
    const response =  await this.clientCommunicator.doPost<LoadMoreIemsRequest, LoadMoreItemsResponse>(request, endpoint);
    console.log(response);
    return LoadMoreItemsResponse.fromJson(response);
  }

  async follow(request: GetFollowersCountRequest) : Promise<TweeterResponse>{
    const endpoint = "/follow";
    return await this.clientCommunicator.doPost<GetFollowersCountRequest, TweeterResponse>(request, endpoint);
  }
  async unfollow(request: GetFollowersCountRequest) : Promise<TweeterResponse>{
    const endpoint = "/unfollow";
    return await this.clientCommunicator.doPost<GetFollowersCountRequest, TweeterResponse>(request, endpoint);
  }
  
  async logout(request: LogOutRequest) : Promise<TweeterResponse>{
    const endpoint = "/logout";
    return await this.clientCommunicator.doPost<LogOutRequest, TweeterResponse>(request, endpoint);
  }

  async getUser(request: GetUserRequest) : Promise<GetUserResponse>{
    const endpoint = "/getUser";
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    
    return GetUserResponse.fromJson(response);

  }
  async loadMoreFeedItems(request: LoadMoreStatusItemsRequest) : Promise<LoadMoreStatusItemsResponse>{
    const endpoint = "/loadMoreFeedItems";
    const response =  await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse>(request, endpoint);
    return LoadMoreStatusItemsResponse.fromJson(response);

  }
  async loadMoreStoryItems(request: LoadMoreStatusItemsRequest) : Promise<LoadMoreStatusItemsResponse>{
    const endpoint = "/loadMoreStoryItems";
    const response =  await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse>(request, endpoint);
    return LoadMoreStatusItemsResponse.fromJson(response);
  }
  async postStatus(request: PostStatusRequest) : Promise<TweeterResponse>{
    const endpoint = "/postStatus";
    const response =  await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    return response;
  }
}
