import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StoryDAOInterface } from "./IDaoFactory";
import { StoryObject } from "../entity/StoryObject";
import { Status, User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";

  export class StoryDAO implements StoryDAOInterface{
    readonly tableName = "storys";
    readonly alias = "alias";
    readonly timestamp = "timestamp";
    readonly post  = "post"

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    private generateStory(alias: string, timestamp:number) {
        return {
            [this.alias]: alias,
            [this.timestamp] : this.timestamp
        };
    }
    public async putStory(storyObj: StoryObject): Promise<void> {
        // console.log("alias" + storyObj._alias);
        // console.log("firstName: "+ storyObj);
        // console.log("lastName: "+ userObj._lastName);
        // console.log("url: "+ userObj._url);
        // console.log("password: "+ userObj._password);
        const params = {
            TableName: this.tableName,
            Item: {
            [this.alias]: storyObj._alias,
            [this.timestamp]: storyObj._timeStamp,
            [this.post]: storyObj._post
            }
        };
        await this.client.send(new PutCommand(params));
    }

    async getPageOfStories(
        lastItem: Status| null,
        limit: number = 10,
        user: User
      ): Promise<DataPage<StoryObject>> {
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
    
        const items: StoryObject[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
          items.push(
            new StoryObject(
              item[this.alias],
              item[this.timestamp],
              item[this.post]
            )
          )
        );
        return new DataPage<StoryObject>(items, hasMorePages);
      }
  }
  