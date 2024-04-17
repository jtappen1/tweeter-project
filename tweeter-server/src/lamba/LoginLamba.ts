import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";


export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> =>{
    
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).login(event);

    return response;
}
