import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ErrorView, Presenter } from "./Presenter";
import { useNavigate } from "react-router-dom";

export interface LogoutView extends ErrorView {
  clearUserInfo:() => void
  navigateToLogin: () => void
}

export class LogoutPresenter extends Presenter{
  private _service: UserService;

    public constructor(view: ErrorView){
        super(view)
        this._service = new UserService();
    }
    protected get view(): LogoutView{
      return super.view  as LogoutView;
    }
    public get userService(){
      return this._service;
    }

    public async logOut(authToken:AuthToken | null) {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
          await this.userService.logout(authToken!);
        
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();
          this.view.navigateToLogin();
        }, "log user out")

      }
      
}