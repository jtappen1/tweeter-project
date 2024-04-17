import { User, AuthToken } from "tweeter-shared";
import { ErrorView, Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView extends View{
    navigate: (originalUrl:string) => void;
    updateUserInfo: (user: User, authToken: AuthToken) => void;
}


export abstract class AuthenticationPresenter extends Presenter{

    public constructor(view: AuthenticationView){
        super(view)
    }
   
    protected get view():AuthenticationView{
        return super.view as AuthenticationView;
    }


    public async authenicate( getAuthenticate: () => Promise<[User,AuthToken]>, updateAndNavigate: ()=>void){
        this.doFailureReportingOperation(async () => {
                
                let [user, authToken] =  await getAuthenticate();
                this.view.updateUserInfo(user, authToken);
                updateAndNavigate();
                
        },  this.getItemDescription());
    }
    protected abstract getItemDescription():String;


}