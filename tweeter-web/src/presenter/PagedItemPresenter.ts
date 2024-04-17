import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
export const PAGE_SIZE = 10;

export interface PageItemView<T> extends View{
    addItems: (items: T[] ) => void;
    
  }

export abstract class PagedItemPresenter<T,U> extends Presenter{

    private _service: U;

    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;

    public constructor(view: PageItemView<T>){
        super(view);
        this._service =  this.createService();
    }   
    protected abstract createService(): U;

    protected get service( ){
        return this._service;
    }

    public get hasMoreItems(){
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }
    protected get lastItem(): T |null{
        return this._lastItem
    }
    protected set lastItem(user: T | null){
        this._lastItem =user;
    }
    protected get view():PageItemView<T>{
        return super.view as PageItemView<T>;
    }

    public async loadMoreItems (authToken: AuthToken, displayedUser: User){
        this.doFailureReportingOperation(async () => {
          if (this.hasMoreItems) {
          let [newItems, hasMore] = await this.getMoreItems(authToken, displayedUser)
          this.hasMoreItems = hasMore;
          this.lastItem= newItems[newItems.length - 1];
          this.view.addItems(newItems);
        }
      }, this.getItemDescription()); 
    }
    protected abstract getItemDescription():String;
    protected abstract getMoreItems(authToken: AuthToken, user: User):Promise<[T[], boolean]>;


    
}


