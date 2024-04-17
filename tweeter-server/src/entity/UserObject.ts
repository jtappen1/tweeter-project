export class UserObject{
    public _alias:string;
    public _url :string;
    public _firstName :string; 
    public _lastName :string;
    public _password :string;
    public _followerCount: number;
    public _followeeCount:number;

    constructor(
        alias: string,
        url: string,
        firstName: string,
        lastName: string,
        password: string,
        followerCount: number,
        followeeCount: number
    ) {
        this._alias = alias;
        this._url = url;
        this._firstName = firstName;
        this._lastName = lastName;
        this._password = password;
        this._followerCount = followerCount;
        this._followeeCount = followeeCount;
    }

}