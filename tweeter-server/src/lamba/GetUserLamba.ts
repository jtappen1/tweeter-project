import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";

export const handler = async (event: GetUserRequest): Promise<GetUserResponse> =>{
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).getUser(event);

    if((await response)._user == null){
        throw new Error("[Bad Request] requested user does not exist")
    }

    return response;
}