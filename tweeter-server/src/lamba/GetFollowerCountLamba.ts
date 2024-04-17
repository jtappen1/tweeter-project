import { GetFollowersCountRequest, GetFollowersCountResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: GetFollowersCountRequest): Promise<GetFollowersCountResponse> =>{
    console.log("Got into handler");
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).getFollowersCount(event);

    // if((await response).followersCount == null){
    //     throw new Error("[Bad Request] requested user does not exist")
    // }

    return response;
}

