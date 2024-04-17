import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ErrorView, Presenter, View } from "./Presenter";

export interface UserInfoView extends ErrorView{
    setIsFollower: (follower: boolean) => void;
    setFollowersCount: (num: number) => void;
    setFolloweesCount: (num: number) => void;
    

}

export class UserInfoPresenter extends Presenter{
    public service: UserService;
    


    public constructor(view: UserInfoView){
      super(view);
      this.service = new UserService();
    }
    protected get view():UserInfoView{
      return super.view as UserInfoView;
    }

    public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User){
      this.doFailureReportingOperation(async () => {
        if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
        } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }}, "determine follower status")
        
    };

    public async setNumbFollowers (authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async () => {
        this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
      }, "get followers count")
        
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
      ){
        this.doFailureReportingOperation(async () => {
          this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
        }, "get followees count");

        
        
      };

    public async followDisplayedUser(displayedUser: User| null, authToken: AuthToken| null){
        this.doFailureReportingOperation( async () => {
          this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);
      
            let [followersCount, followeesCount] = await this.service.follow(
              authToken!,
              displayedUser!
            );
      
            this.view.clearLastInfoMessage();
      
            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        }, "follow user")
        
    };

    
      public async unfollowDisplayedUser (displayedUser: User| null, authToken: AuthToken| null
      ): Promise<void> {
        this.doFailureReportingOperation(async ()=>{
          this.view.displayInfoMessage(
            `Removing ${displayedUser!.name} from followers...`,
            0
          );
    
          let [followersCount, followeesCount] = await this.service.unfollow(
            authToken!,
            displayedUser!
          );
    
          this.view.clearLastInfoMessage();
    
          this.view.setIsFollower(false);
          this.view.setFollowersCount(followersCount);
          this.view.setFolloweesCount(followeesCount);
        }, "unfollow user")
        
      };
}