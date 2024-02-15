import { AuthToken, User } from "tweeter-shared";
import { NavigateService } from "../model/service/NavigateService";

 export interface NavigateView{
        displayErrorMessage: (message:string) =>void;
        setDisplayedUser: (currentUser: User) => void;
      }

export class NavigatePresenter{

    private service:NavigateService;
    private view: NavigateView;

    public constructor(view: NavigateView ){
        this.service = new NavigateService();
        this.view = view;
    }

      public async navigate(authToken:AuthToken | null, currentUser: User|null, aliasString: string): Promise<void>{
        try {
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
            } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
            }
      }
      public extractAlias = (value: string): string => {
        let index = value.indexOf("@");
        return value.substring(index);
      };
      
}