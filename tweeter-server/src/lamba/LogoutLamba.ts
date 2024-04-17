import { LogOutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";


export const handler = async (event: LogOutRequest): Promise<TweeterResponse> =>{
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).logout(event);

    return response;
}