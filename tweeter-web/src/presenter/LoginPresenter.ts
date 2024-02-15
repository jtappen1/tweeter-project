import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface LoginView{
    displayErrorMessage: (message:string) =>void;
    navigate: (originalUrl:string) => void;
    updateUserInfo: (user: User, authToken: AuthToken) => void;
}
export class LoginPresenter{
    private service: UserService;
    private view: LoginView;

    public constructor(view: LoginView){
        this.view = view
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, originalUrl:string): Promise<void> {
        try {
          let [user, authToken] =  await this.service.login(alias, password);
    
          this.view.updateUserInfo(user, authToken);
    
          if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        }
      };
}