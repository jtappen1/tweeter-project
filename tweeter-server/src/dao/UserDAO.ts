import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserDAOInterface } from "./IDaoFactory";
import { UserObject } from "../entity/UserObject";

export class UserDAO implements UserDAOInterface{
    readonly tableName = "users";
    readonly alias = "alias";
    readonly url = "imageURL";
    readonly firstName = "firstName";  
    readonly lastName = "lastName";
    readonly password = "password";
    readonly followerCount = "followerCount";
    readonly followeeCount = "followeeCount";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


    private generateUser(alias: string) {
        return {
            [this.alias]: alias,
        };
    }
    async getUser(alias: string): Promise<UserObject | undefined>{
        const params = {
          TableName: this.tableName,
          Key: this.generateUser(alias),
        };
        const output = await this.client.send(new GetCommand(params));
  
        if (
          output.Item === undefined ||
          output.Item[this.alias] === undefined
        ) {
          return undefined;
        } else {
          return new UserObject(output.Item[this.alias],
            output.Item[this.url],
            output.Item[this.firstName], 
            output.Item[this.lastName],
            output.Item[this.password],
            output.Item[this.followerCount],
            output.Item[this.followeeCount]
            );
        }
      }

    public async putUser(userObj: UserObject): Promise<void> {
        console.log("alias" + userObj._alias);
        console.log("firstName: "+ userObj._firstName);
        console.log("lastName: "+ userObj._lastName);
        console.log("url: "+ userObj._url);
        console.log("password: "+ userObj._password);
        const params = {
            TableName: this.tableName,
            Item: {
            [this.alias]: userObj._alias,
            [this.firstName]: userObj._firstName,
            [this.lastName]: userObj._lastName,
            [this.url]: userObj._url,
            [this.password]: userObj._password,
            [this.followerCount]: userObj._followerCount,
            [this.followeeCount]: userObj._followeeCount
            }
        };
        await this.client.send(new PutCommand(params));
    }
    public async incrementFollowersCount(alias: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateUser(alias),
        ExpressionAttributeValues: { ":inc": 1 },
        UpdateExpression:
          "SET " + this.followerCount + " = " + this.followerCount + " + :inc",
      };
      await this.client.send(new UpdateCommand(params));
    }

    public async incrementFolloweesCount(alias: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateUser(alias),
        ExpressionAttributeValues: { ":inc": 1 },
        UpdateExpression:
          "SET " + this.followeeCount + " = " + this.followeeCount + " + :inc",
      };
      await this.client.send(new UpdateCommand(params));
    }

    public async decrementFolloweesCount(alias: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateUser(alias),
        ExpressionAttributeValues: { ":inc": 1 },
        UpdateExpression:
          "SET " + this.followeeCount + " = " + this.followeeCount + " - :inc",
      };
      await this.client.send(new UpdateCommand(params));
    }
    public async decrementFollowersCount(alias: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateUser(alias),
        ExpressionAttributeValues: { ":inc": 1 },
        UpdateExpression:
          "SET " + this.followerCount + " = " + this.followerCount + " - :inc",
      };
      await this.client.send(new UpdateCommand(params));
    }

}