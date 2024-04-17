import { AuthToken, User } from "tweeter-shared";
import { NavigateService } from "../model/service/NavigateService";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

 export interface NavigateView extends View{
        setDisplayedUser: (currentUser: User) => void;
}

export class NavigatePresenter extends Presenter{

    private service:UserService;

    public constructor(view: NavigateView ){
        super(view);
        this.service = new UserService();
    }
    protected get view(): NavigateView{
      return super.view  as NavigateView;
    }

      public async navigate(authToken:AuthToken | null, currentUser: User|null, aliasString: string): Promise<void>{
        this.doFailureReportingOperation(async () => {
          let alias = this.extractAlias(aliasString);
    
            let user = await this.service.getUser(authToken!, alias);
            console.log("Inside navigate");
            if (!!user) {
                if (currentUser!.equals(user)) {
                this.view.setDisplayedUser(currentUser!);
                } else {
                this.view.setDisplayedUser(user);
                }
            }
        }, "get user")
      }
      public extractAlias = (value: string): string => {
        let index = value.indexOf("@");
        return value.substring(index);
      };
      
}