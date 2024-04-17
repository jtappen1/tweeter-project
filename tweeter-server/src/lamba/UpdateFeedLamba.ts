import { DynamoDAOFactory } from "../dao/DaoFactory";
import { StatusService } from "../model/service/StatusService";


export const handler = async function (event: any) {
    let username: string = "";
    let post: string = "";
    let timestamp:string = "";
    
    console.log("Event: " + event);
    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      console.log("Body"+body);
      const aliasIndex = body.indexOf("Alias:");
      const postIndex = body.indexOf("Post:");
      const timestampIndex = body.indexOf("Timestamp:");
        if (aliasIndex !== -1) {
            const usernameStartIndex = aliasIndex + "Alias:".length;
            const timeStampStartIndex = timestampIndex + "Timestamp:".length;
            const postStartIndex = postIndex + "Post:".length;
            username = body.substring(usernameStartIndex, timeStampStartIndex-"Timestamp:".length ).trim();

            timestamp = body.substring(timeStampStartIndex, postStartIndex- "Post:".length).trim();

            post = body.substring(postStartIndex).trim();

            

            console.log("Username:" + username);
            console.log("Timestamp:" + timestamp);
            console.log("Post:" + post)
        } else {
            console.log("DID NOT FIND ALIAS IN BODY TEXT")
            return null; // "Alias:" substring not found
        }
    }
    
    const factoryDao = new DynamoDAOFactory();
    console.log("Got to Factory");
    let response = await new StatusService(factoryDao).getFollowers(username,timestamp, post);
    console.log(response);
  };

