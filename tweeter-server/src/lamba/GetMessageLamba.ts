import { DynamoDAOFactory } from "../dao/DaoFactory";
import { StatusService } from "../model/service/StatusService";

export const handler = async function (event: any) {
    let splitArray: string[] = [];
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        splitArray = body.split(",");
        
    } 
    console.log("Split Array:"+ splitArray);
    // const length = splitArray.length;
    const author = splitArray.pop()
    if(author === undefined){
        throw new Error("Author is undefined");
    }
    
    const post = splitArray.pop()
    if(post === undefined){
        throw new Error("post is undefined");
    }
    const string = splitArray.pop();
    if(string === undefined){
        throw new Error("Timestamp is undefined");
    }
    const timeStamp = parseInt(string);
    // console.log("Length:", length);
    console.log("Author:", author);
    console.log("Post:", post);
    console.log("TimeStamp:", timeStamp);

    const factoryDao = new DynamoDAOFactory();
    console.log("Split array: "+ splitArray)
    await new StatusService(factoryDao).writeToFeedTable(splitArray, timeStamp, post, author);
    
}