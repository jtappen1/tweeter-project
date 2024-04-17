export declare class RegisterRequest {
    private _firstName;
    private _lastName;
    private _alias;
    private _password;
    private _userImageBytes;
    constructor(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array);
    get firstName(): string;
    get lastName(): string;
    get alias(): string;
    get password(): string;
    get userImageBytes(): Uint8Array;
}
