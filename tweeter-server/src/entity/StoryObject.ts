export class StoryObject{

    public _alias : string;
    public _timeStamp: number;
    public _post: string; 
    
    constructor(alias: string, timeStamp: number, post: string) {
        this._alias = alias;
        this._timeStamp = timeStamp;
        this._post = post;
    }

}