import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthtokenDAOInterface } from "./IDaoFactory";
import { AuthTokenObject } from "../entity/AuthtokenObject";
import { AuthToken } from "tweeter-shared";

  export class AuthtokenDAO implements AuthtokenDAOInterface{
    readonly tableName = "auth";
    readonly authtoken = "authtoken";
    readonly alias = "alias";
    readonly timestamp = "timestamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async putAuth(authtokenObject : AuthTokenObject): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
            [this.authtoken]: authtokenObject._authtoken,
            [this.timestamp]: authtokenObject._timeStamp,
            [this.alias]: authtokenObject._alias
            }
        };
        await this.client.send(new PutCommand(params));
    }
    async deleteToken(authToken: AuthToken): Promise<void> {
        console.log("Auth: "+ authToken.token)
        const params = {
          TableName: this.tableName,
          Key: this.generateAuthtoken(authToken),
        };
        await this.client.send(new DeleteCommand(params));
      }

    private generateAuthtoken(authtoken: AuthToken) {
        return {
            [this.authtoken]: authtoken.token,
        };
    }

    async getAlias(authtoken: AuthToken): Promise<string | undefined>{
      const params = {
        TableName: this.tableName,
        Key: this.generateAuthtoken(authtoken),
      };
      const output = await this.client.send(new GetCommand(params));
    
      if (
        output.Item === undefined ||
        output.Item[this.alias] === undefined
      ) {
        return undefined;
      }
      else{
        console.log("Authtoken Dao returns this alias: " + output.Item[this.alias])
        return output.Item[this.alias]
      }

    }
    async isAuthenticated(authtoken: AuthToken): Promise<boolean | undefined>{
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthtoken(authtoken),
          };
          const output = await this.client.send(new GetCommand(params));
    
          if (
            output.Item === undefined ||
            output.Item[this.alias] === undefined
          ) {
            return undefined;
          } else {
            const timestamp = new Date(output.Item[this.timestamp]).toTimeString();
            const curTime = new Date().toTimeString();

            const [timeStampHours, timeStampMinutes, timeStampSeconds] = timestamp.split(":");

            const [curHours, curMinutes, curSeconds] = curTime.split(":");

            if(curHours !== timeStampHours){
                return false;
            }
            else{
                return this.areLessThanFiveMinutesApart(parseInt(timeStampMinutes), parseInt(curMinutes));
            }
          }
    }
    private areLessThanFiveMinutesApart(minute1: number, minute2: number): boolean {
        const MINUTES_IN_HOUR = 60;
        const MINUTES_THRESHOLD = 5;
      
        // Convert minutes to seconds for comparison
        const seconds1 = minute1 * 60;
        const seconds2 = minute2 * 60;
      
        // Calculate the absolute difference in seconds
        const diffSeconds = Math.abs(seconds1 - seconds2);
      
        // Check if the difference is more than 5 minutes (300 seconds)
        return diffSeconds < (MINUTES_THRESHOLD * MINUTES_IN_HOUR);
      }

  }