import {  GetFollowersCountRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";


export const handler = async (event: GetFollowersCountRequest): Promise<TweeterResponse> =>{
    console.log("Inside Follows Handler");
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).follow(event);

    return response;
}