import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class LoadMoreStatusItemsResponse extends TweeterResponse{

    public _items: [Status[], boolean]
    

    public constructor(success: boolean, items: [Status[], boolean], message:string){
        super(success, message);
        this._items = items;
    }
    public get items(){
        return this._items;
    }
    static fromJson(json: LoadMoreStatusItemsResponse): LoadMoreStatusItemsResponse {
        interface LoadMoreItemsResponseJson extends TweeterResponse{
         _items: JSON[];
        }
        const jsonObject: LoadMoreItemsResponseJson =
          json as unknown as LoadMoreItemsResponseJson;
    
        console.log("Items:" + jsonObject._items)
        
        let deserializedStatusArray:Status[] = [];
    
        let deserializeHasMorePages : boolean = false;
        jsonObject._items.forEach((jsonValue: any) => {
        // Inside this function, jsonValue represents each JSON object in the array
        // You can access properties of jsonValue using dot notation
          if(jsonValue == true){
            console.log("Has more pages: " + deserializeHasMorePages)
              deserializeHasMorePages= jsonValue
          }
          else{
            for(let jsonObject in jsonValue){
              const specificUser = jsonValue.at(jsonObject);
              // console.log("new val:" +jsonValue.at(jsonObject));
              
              const deserializedStatus = Status.fromJson(JSON.stringify(specificUser)); 
              console.log("Deserialized Status Post: "+ deserializedStatus?.post)
              if(deserializedStatus != null){
                  deserializedStatusArray.push(deserializedStatus)
              }
            }
            // jsonValue.forEach((value: any) => {
              
            // });
          }
        
        });
        const itemsArray: [Status[], boolean] = [deserializedStatusArray, deserializeHasMorePages]
    
        if(jsonObject._message != null){
            return new LoadMoreStatusItemsResponse(
                jsonObject._success,
                itemsArray,
                jsonObject._message
            )
        }
        else{
            return new LoadMoreStatusItemsResponse(
                jsonObject._success,
                itemsArray,
                "Error"
            )
        }
    };
}

    


    // static fromJson(json: LoadMoreItemsResponse): LoadMoreItemsResponse {
    //     interface LoadMoreItemsResponseJson extends TweeterResponse {
    //       _user: JSON;
    //       _token: JSON;
    //     }
    
    //     const jsonObject: LoadMoreItemsResponseJson =
    //       json as unknown as LoadMoreItemsResponseJson;
    //     const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
    
    //     if (deserializedUser === null) {
    //       throw new Error(
    //         "AuthenticateResponse, could not deserialize user with json:\n" +
    //           JSON.stringify(jsonObject._user)
    //       );
    //     }
    
    //     const deserializedToken = AuthToken.fromJson(
    //       JSON.stringify(jsonObject._token)
    //     );
    
    //     if (deserializedToken === null) {
    //       throw new Error(
    //         "AuthenticateResponse, could not deserialize token with json:\n" +
    //           JSON.stringify(jsonObject._token)
    //       );
    //     }
    //     console.log(deserializedUser.firstName + " " + deserializedToken.token);
    
    //     return new AuthenticateResponse(
    //       jsonObject.success,
    //       deserializedUser,
    //       deserializedToken,
    //       jsonObject.message
    //     );
    //   }