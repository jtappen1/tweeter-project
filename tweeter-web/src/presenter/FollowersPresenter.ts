import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { useEffect } from "react";


export interface FollowView{
  addItems: (items: User[] ) => void;
  displayErrorMessage: (message:string) =>void;
}
export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter{
    private lastItem: User | null = null;

    private service:FollowService;

    public constructor(view: UserItemView){
        super(view);
        this.service = new FollowService();
    }
    
    public async loadMoreItems (authToken: AuthToken, displayedUser: User){
  
        try {
          if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreFollowers(authToken,displayedUser,PAGE_SIZE,this.lastItem);
    
            this.hasMoreItems = hasMore;
            this.lastItem= newItems[newItems.length - 1];
            this.view.addItems(newItems);
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load follower items because of exception: ${error}`
          );
        }
      };
}