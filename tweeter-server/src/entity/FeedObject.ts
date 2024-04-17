export class FeedObject{
    public _alias : string;
    public _timeStamp: number;
    public _post: string;
    public _postAuthor: string;

    constructor(alias: string, timeStamp: number, post: string, postAuthor:string) {
        this._alias = alias;
        this._timeStamp = timeStamp;
        this._post = post;
        this._postAuthor = postAuthor;
    }

}