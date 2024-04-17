import { AuthenticateResponse, RegisterRequest} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../dao/DaoFactory";


export const handler = async (event: RegisterRequest): Promise<AuthenticateResponse> =>{
    console.log("Added Got into Register Handler");
    const factoryDao = new DynamoDAOFactory();
    let response  = new UserService(factoryDao).register(event);

    return response;
}

