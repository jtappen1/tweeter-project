import { TweeterResponse } from "./TweeterResponse";

export class GetIsFollowerStatusResponse extends TweeterResponse{
    public _isFollower: boolean;

    public constructor(success: boolean, isFollower: boolean, message: string){
        super(success,message);
        this._isFollower = isFollower;
    }
    public get isFollower(){
        return this._isFollower;
    }
}