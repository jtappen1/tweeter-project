export declare class TweeterResponse {
    private _success;
    private _message;
    constructor(success: boolean, message?: string | null);
    get success(): boolean;
    get message(): string | null;
}
