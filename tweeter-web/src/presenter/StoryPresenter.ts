import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";



export class StoryPresenter extends StatusItemPresenter{
    protected getItemDescription(): String {
      return  "load followee";
    }
    protected getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
      return this.service.loadMoreStoryItems(authToken,user,PAGE_SIZE,this.lastItem);
    }
    
}