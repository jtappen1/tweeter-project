

export class RegisterRequest{
    public _firstName: string;
    public _lastName: string;
    public _alias: string;
    public _password: string;
    public _userImageBytes: Uint8Array;

    public constructor(firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array){
            this._firstName = firstName;
            this._lastName =  lastName;
            this._alias = alias;
            this._password = password;
            this._userImageBytes = userImageBytes;

    }

    // Getter for _firstName
    public get firstName(): string {
        return this._firstName;
    }

    // Getter for _lastName
    public get lastName(): string {
        return this._lastName;
    }

    // Getter for _alias
    public get alias(): string {
        return this._alias;
    }

    // Getter for _password
    public get password(): string {
        return this._password;
    }

    // Getter for _userImageBytes
    public get userImageBytes(): Uint8Array {
        return this._userImageBytes;
    }
}
