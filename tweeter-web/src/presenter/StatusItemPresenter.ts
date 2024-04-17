import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView extends View{
    addItems: (items: Status[] ) => void;
    
  }

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>{
    
    protected createService(): StatusService{
        return new StatusService();
    }
}