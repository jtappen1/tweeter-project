import { LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: LoadMoreStatusItemsRequest): Promise<LoadMoreStatusItemsResponse> =>{
    console.log("Got into handler for LoadMoreStoryItems");
    const factoryDao = new DynamoDAOFactory();
    let response  = new StatusService(factoryDao).loadMoreStoryItems(event);

    return response;
}