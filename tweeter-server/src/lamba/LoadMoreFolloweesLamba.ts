import { LoadMoreIemsRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: LoadMoreIemsRequest): Promise<LoadMoreItemsResponse> =>{
    console.log("Got into handler for LoadMoreFollowees");
    const factoryDao = new DynamoDAOFactory();
    let response  = new FollowService(factoryDao).loadMoreFollowees(event);

    return response;
}