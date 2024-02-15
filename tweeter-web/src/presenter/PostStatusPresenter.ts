import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
export interface PostStatusView{
    displayErrorMessage: (message:string) =>void;
    displayInfoMessage: (message:string, num: number) =>void;
    clearLastInfoMessage: () => void;
    setPost:( message:string) => void;
}

export class PostStatusPresenter{
    private view: PostStatusView;
    private service: StatusService;
    
    public constructor(view: PostStatusView){
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost  (post: string, currentUser: User |null, authToken: AuthToken| null)  {
    
        try {
          this.view.displayInfoMessage("Posting status...", 0);
    
          let status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.view.clearLastInfoMessage();
          this.view.setPost("");
          this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        }
      };
      
    
      public async clearStatus(){
        this.view.setPost("");
      }
}