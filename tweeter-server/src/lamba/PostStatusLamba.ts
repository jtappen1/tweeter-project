import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> =>{
    console.log("Got into handler");
    const factoryDao = new DynamoDAOFactory();
    let response  = new StatusService(factoryDao).postStatus(event);

    return response;
}