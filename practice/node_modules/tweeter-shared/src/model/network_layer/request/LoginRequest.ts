
export class LoginRequest{
    public _alias: string;
    public _password: string;

    constructor(alias: string, password: string){
        this._alias =alias;
        this._password = password;
    }
    public get alias(){
        return this._alias;
    }
    public get password(){
        return this._password;
    }

}