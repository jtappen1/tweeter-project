import {  GetFollowersCountRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { follows } from "../entity/Follower";
import { DynamoDAOFactory } from "../dao/DaoFactory";


export const handler = async (event: GetFollowersCountRequest): Promise<TweeterResponse> =>{
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).unfollow(event);

    return response;
}