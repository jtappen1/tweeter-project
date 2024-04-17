import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

// export interface FeedView{
//     addItems: (items: Status[] ) => void;
//     displayErrorMessage: (message:string) =>void;
//   }
  // export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter{
    protected getItemDescription(): String {
      return "load follower";
    }
    protected getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
      return this.service.loadMoreFeedItems(authToken,user,PAGE_SIZE,this.lastItem);
    }
    
}