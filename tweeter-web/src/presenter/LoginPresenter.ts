import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";


// export interface LoginView extends AuthenticationView{
//     // displayErrorMessage: (message:string) =>void;
//     // navigate: (originalUrl:string) => void;
//     // updateUserInfo: (user: User, authToken: AuthToken) => void;
// }
export class LoginPresenter extends AuthenticationPresenter{
  
  protected getItemDescription(): String {
    return "log user";
  }
    private service: UserService;
    

    public constructor(view: AuthenticationView){
        
        super(view)
        this.service = new UserService();
    }

    
    


    public async doLogin(alias: string, password: string, originalUrl:string): Promise<void> {
      this.authenicate( 
        () => this.service.login(alias, password), () => {
        if (!!originalUrl) {
              this.view.navigate(originalUrl);
        } else {
              this.view.navigate("/");
        }
      })
        
      };
}