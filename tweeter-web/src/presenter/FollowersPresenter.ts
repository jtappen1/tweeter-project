import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import {  UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";


// export interface FollowView{
//   addItems: (items: User[] ) => void;
//   displayErrorMessage: (message:string) =>void;
// }
// export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter{
    protected getItemDescription(): String {
      return "load follower items";
    }
    protected getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
      return this.service.loadMoreFollowers(authToken,user,PAGE_SIZE,this.lastItem);
    }
    
}