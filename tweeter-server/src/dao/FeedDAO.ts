import {
    BatchWriteCommand,
    BatchWriteCommandInput,
    BatchWriteCommandOutput,
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FeedDAOInterface, StoryDAOInterface } from "./IDaoFactory";
import { StoryObject } from "../entity/StoryObject";
import { Status, User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { FeedObject } from "../entity/FeedObject";
import { follows } from "../entity/Follower";
import { execSync } from "child_process";
import { commonParams } from "@aws-sdk/client-sqs/dist-types/endpoint/EndpointParameters";
  export class FeedDAO implements FeedDAOInterface{
    readonly tableName = "feeds";
    readonly alias = "alias";
    readonly timestamp = "timestamp";
    readonly post  = "post";
    readonly post_author = "post_author";



    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    private generateFeed(alias: string, timestamp:number) {
        return {
            [this.alias]: alias,
            [this.timestamp] : timestamp
        };
    }
    public async putFeed(feedObj: FeedObject): Promise<void> {
        // console.log("alias" + storyObj._alias);
        // console.log("firstName: "+ storyObj);
        // console.log("lastName: "+ userObj._lastName);
        // console.log("url: "+ userObj._url);
        // console.log("password: "+ userObj._password);
        const params = {
            TableName: this.tableName,
            Item: {
            [this.alias]: feedObj._alias,
            [this.timestamp]: feedObj._timeStamp,
            [this.post]: feedObj._post,
            [this.post_author]: feedObj._postAuthor
            }
        };
        await this.client.send(new PutCommand(params));
    }

    public async getPageOfFeeds(
        lastItem: Status| null,
        limit: number = 10,
        user: User
      ): Promise<DataPage<FeedObject>> {
        const params = {
          KeyConditionExpression: this.alias + " = :v",
          ExpressionAttributeValues: {
            ":v": user.alias,
          },
          TableName: this.tableName,
          Limit: limit,
          ExclusiveStartKey:
            lastItem === null
              ? undefined
              : {
                //partition follower
                //sort followee
                  [this.alias]: user.alias,
                  [this.timestamp]: lastItem?.timestamp,
                },
              ScanIndexForward: false
        };
    
        const items: FeedObject[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
          items.push(
            new FeedObject(
              item[this.alias],
              item[this.timestamp],
              item[this.post],
              item[this.post_author]
            )
          )
        );
        return new DataPage<FeedObject>(items, hasMorePages);
    }

    public async createFeedWrite(followsList: string[], timeStamp:number, post:string, author:string):Promise<void>{
        // console.log("In create FeedWrite:" + followsList)
        if(followsList.length == 0){
          console.log('zero followers to batch write');
          return;
        }
        if(timeStamp == null || timeStamp == undefined){
            console.log("TimeSTAMP IS NULL" +  timeStamp);
        }
        if(author == null || author == undefined){
            console.log("AUTHOR IS NULL" +  author);
        }
        if(post == null || post == undefined){
            console.log("POST IS NULL" +  post);
        }
        else{
          const params = {
            RequestItems: {
              [this.tableName]: this.createPutUserRequestItems(followsList, timeStamp, post, author)
            }
          }
        //   console.log("Item: " + params.RequestItems.feeds.at(0)?.PutRequest.Item)
          await this.client.send(new BatchWriteCommand(params))
          .then(async (resp) => {
            await this.putUnprocessedItems(resp, params,0);
          })
          .catch(err => {
            console.log(params.RequestItems.feeds)
            throw new Error('Error while batchwriting users with params: '+ params.RequestItems.feeds.at(params.RequestItems.feeds.length-1)?.PutRequest.Item.alias + ": \n" + err);
        });;
        }
    }
    
    private createPutUserRequestItems(follows_array:string[], timeStamp:number, post:string, author:string){
        return follows_array.map(follows_obj => this.createPutUserRequest(follows_obj, timeStamp, post, author));
    }

    private createPutUserRequest(follows_obj: string, timestamp:number, post:string, author:string){
        if(follows_obj == null || follows_obj == undefined){
            throw new Error("FOLLOWS OBJ UNDEIFNED");
        }
        // console.log("alias:" + follows_obj);
        let item = {
            [this.alias]: follows_obj,
            [this.timestamp]: timestamp,
            [this.post]: post,
            [this.post_author]: author,
        }
        let request = {
            PutRequest: {
                Item: item
            }
        }
        return request;
    }
  
    // private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput){
    //     console.log("GOT INTO UNPROCESSED ITEMS");
    //   if(resp.UnprocessedItems != undefined){
    //       let sec = 0.01;
    //       while(Object.keys(resp.UnprocessedItems).length > 0) {
    //           console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
    //           //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
    //           // @ts-ignore 
    //           params.RequestItems = resp.UnprocessedItems;
    //           execSync('sleep ' + sec);
    //           if(sec < 1) sec += 0.1;
    //           await this.client.send(new BatchWriteCommand(params));
    //           if(resp.UnprocessedItems == undefined){
    //               break;
    //           }
    //         }
    //     }
    // }
    private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number){
        if(attempts > 1) console.log(attempts + 'th attempt starting');
    ;   if(resp.UnprocessedItems != undefined){
          let sec = 0.03;
          if (Object.keys(resp.UnprocessedItems).length > 0) {
              console.log(Object.keys(resp.UnprocessedItems[this.tableName]).length + ' unprocessed items');
              //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
              // @ts-ignore 
              params.RequestItems = resp.UnprocessedItems;
              execSync('sleep ' + sec);
              if(sec < 10) sec += 0.1;
              await this.client.send(new BatchWriteCommand(params))
                .then(async (innerResp) => {
                    if(innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0){
                        params.RequestItems = innerResp.UnprocessedItems;
                        ++attempts
                        await this.putUnprocessedItems(innerResp, params, attempts)
                }
                }).catch(err => {
                    console.log('error while batch writing unprocessed items ' + err);
                });
              
          }
        }
      }

      
    
}