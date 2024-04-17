export class follows{
    public _follower_handle:string;
    public _followee_handle:string;
    public _follower_name:string;
    public _followee_name:string

    public constructor(follower_handle:string , followee_handle:string, follower_name:string, followee_name:string){
        this._follower_handle = follower_handle;
        this._followee_handle = followee_handle;
        this._follower_name =  follower_name;
        this._followee_name = followee_name;
    }

}