
import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> =>{
    console.log("Got into handler for GetIsFollowerStatus");
    const factoryDao = new DynamoDAOFactory();
    
    let response  = new UserService(factoryDao).getIsFollowerStatus(event);

    return response;
}