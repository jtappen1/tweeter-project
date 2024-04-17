import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { ErrorView, Presenter } from "./Presenter";
export interface PostStatusView extends ErrorView{
    setPost:( message:string) => void;
    // clearStatus:() => void;
}

export class PostStatusPresenter extends Presenter{
    
    private service: StatusService;
    
    public constructor(view: PostStatusView){
        super(view);
        // view.clearStatus = this.clearStatus;
        this.service = new StatusService();
    }
    protected get view(): PostStatusView{
      return super.view as PostStatusView;
    }
    public get postService(): StatusService{
      return this.service;
    }

    public async submitPost  (post: string, currentUser: User |null, authToken: AuthToken| null)  {
      this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);
    
      // let status = new Status(post, currentUser!, Date.now());
      let status = new Status(post, currentUser!, Date.now());
      

      await this.postService.postStatus(authToken!, status);

      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);}, 
      "post the status")
    }
        
      public async clearStatus(){
        this.view.setPost("");
      }
}