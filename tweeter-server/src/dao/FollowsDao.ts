import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { follows } from "../entity/Follower";
  import { DataPage } from "../entity/DataPage";
import { FollowsDAOInterface } from "./IDaoFactory";
import { User } from "tweeter-shared";
  
  export class FollowsDAO implements FollowsDAOInterface{
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerAttr = "follower_handle";
    readonly followeeAttr = "followee_handle"; // 'location' is a reserved keyword. A column can be named location, but then pagination cannot query using that column.
    // readonly visitCountAttr = "visit_count";
    readonly followerNameAttr = "follower_name";
    readonly followeeNameAttr = "followee_name";
   
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  
    /**
     * Retrieve the number of times visitor has visited location
     *
     * @param visit
     * @return
     */

    async getFollowing(follows: follows): Promise<boolean | undefined>{
      const params = {
        TableName: this.tableName,
        Key: this.generateVisitItem(follows)
      };
      const output = await this.client.send(new GetCommand(params));
      console.log("Output item:" + output.Item);

      if (
        output.Item === undefined ||
        output.Item[this.followerAttr] === undefined
      ) {
        return false;
      } else {
        console.log(output.Item[this.followerAttr]);
        return true;
        
      }
    }
  
    // /**
    //  * Increment the number of times visitor has visited location
    //  *
    //  * @param visit
    //  */
    // async recordVisit(visit: Visit): Promise<void> {
    //   // load it if it exists
    //   const visitInDatabase: Visit | undefined = await this.getVisit(visit);
    //   if (visitInDatabase !== undefined) {
    //     await this.incrementVisit(visit);
    //   } else {
    //     visit.visit_count = 1;
    //     await this.putVisit(visit);
    //   }
    // }
  
    public async putFollows(follows: follows): Promise<void> {
      console.log("Got into the putFollows");
      const params = {
        TableName: this.tableName,
        Item: {
          [this.followerAttr]: follows._follower_handle,
          [this.followeeAttr]: follows._followee_handle,
          [this.followerNameAttr] : follows._follower_name,
          [this.followeeNameAttr] :follows._followee_name,
        },
      };
      await this.client.send(new PutCommand(params));
    }
  
    public async updateFollows(follows: follows, newFollower: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateVisitItem(follows),
        UpdateExpression:
          "SET " + this.followeeNameAttr + " = " + this.followeeNameAttr,
      };
      await this.client.send(new UpdateCommand(params));
    }

    async getPageOfFollowers(
      lastItem: User| null,
      limit: number = 10,
      user: User
    ): Promise<DataPage<follows>> {
      const params = {
        KeyConditionExpression: this.followeeAttr + " = :v",
        ExpressionAttributeValues: {
          ":v": user.alias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
        Limit: limit,
        ExclusiveStartKey:
          lastItem === null
            ? undefined
            : {
              //partition follower
              //sort followee
                [this.followeeAttr]: user.alias,
                [this.followerAttr]: lastItem?.alias,
              },
            ScanIndexForward: false
      };
  
      const items: follows[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        items.push(
          new follows(
            item[this.followerAttr],
            item[this.followeeAttr],
            item[this.followerNameAttr],
            item[this.followeeNameAttr]
          )
        )
      );
      return new DataPage<follows>(items, hasMorePages);
    }

    async getPageOfFollowees(
      lastItem: User| null,
      limit: number = 10,
      user: User
    ): Promise<DataPage<follows>> {
      const params = {
        KeyConditionExpression: this.followerAttr + " = :v",
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
                [this.followerAttr]: user.alias,
                [this.followeeAttr]: lastItem?.alias,
              },
            ScanIndexForward: false
      };
  
      const items: follows[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        items.push(
          new follows(
            item[this.followerAttr],
            item[this.followeeAttr],
            item[this.followerNameAttr],
            item[this.followeeNameAttr]
          )
        )
      );
      return new DataPage<follows>(items, hasMorePages);
    }










    // async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<follows>> {

    //   const params = {
    //     KeyConditionExpression: followerHandle + " = :followee",
    //     ExpressionAttributeValues: {
    //       ":followee": followerHandle,
    //     },
    //     TableName: this.tableName,
    //     // IndexName: this.indexName,
    //     Limit: pageSize,
    //     ExclusiveStartKey:
    //       lastFolloweeHandle === undefined
    //         ? undefined
    //         : {
    //             [this.followerAttr]: followerHandle,
    //             [this.followeeAttr]: lastFolloweeHandle,
    //           },
    //   };

    //   const items: follows[] = [];
    //   const data = await this.client.send(new QueryCommand(params));
    //   const hasMorePages = data.LastEvaluatedKey !== undefined;
    //   data.Items?.forEach((item) =>
    //     items.push(
    //       new follows(
    //         item[this.followerAttr],
    //         item[this.followeeAttr],
    //         item[this.followerNameAttr],
    //         item[this.followeeNameAttr]
    //       )
    //     )
    //   );
    //   return new DataPage<follows>(items, hasMorePages);
    //   }

      // async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<follows>> { 
      //   const params = {
      //     KeyConditionExpression: followeeHandle + " = :followee",
      //     ExpressionAttributeValues: {
      //       ":followee": followeeHandle,
      //     },
      //     TableName: this.tableName,
      //     // IndexName: this.indexName,
      //     Limit: pageSize,
      //     ExclusiveStartKey:
      //       lastFollowerHandle === undefined
      //         ? undefined
      //         : {
      //             [this.followerAttr]: followeeHandle,
      //             [this.followeeAttr]: lastFollowerHandle,
      //           },
      //   };
  
      //   const items: follows[] = [];
      //   const data = await this.client.send(new QueryCommand(params));
      //   const hasMorePages = data.LastEvaluatedKey !== undefined;
      //   data.Items?.forEach((item) =>
      //     items.push(
      //       new follows(
      //         item[this.followerAttr],
      //         item[this.followeeAttr],
      //         item[this.followerNameAttr],
      //         item[this.followeeNameAttr]
      //       )
      //     )
      //   );
      //   return new DataPage<follows>(items, hasMorePages);
      //  }
  
    // private async getVisit(visit: Visit): Promise<Visit | undefined> {
    //   const params = {
    //     TableName: this.tableName,
    //     Key: this.generateVisitItem(visit),
    //   };
    //   const output = await this.client.send(new GetCommand(params));
    //   return output.Item == undefined
    //     ? undefined
    //     : new Visit(
    //         output.Item[this.visitorAttr],
    //         output.Item[this.locationAttr],
    //         output.Item[this.visitCountAttr]
    //       );
    // }
  
    // /**
    //  * Delete all visits of visitor to location
    //  *
    //  * @param visit
    //  */
    async deleteFollows(follows: follows): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: this.generateVisitItem(follows),
      };
      await this.client.send(new DeleteCommand(params));
    }
  
    // /**
    //  * Fetch the next page of locations visited by visitor
    //  *
    //  * @param visitor The visitor of interest
    //  * @param lastLocation The last location returned in the previous page of results
    //  * @param limit The maximum number of locations to include in the result
    //  * @return The next page of locations visited by visitor
    //  */
    // async getVisitedLocations(
    //   visitor: string,
    //   lastLocation: string | undefined = undefined,
    //   limit: number = 2
    // ): Promise<DataPage<Visit>> {
    //   const params = {
    //     KeyConditionExpression: this.visitorAttr + " = :v",
    //     ExpressionAttributeValues: {
    //       ":v": visitor,
    //     },
    //     TableName: this.tableName,
    //     Limit: limit,
    //     ExclusiveStartKey:
    //       lastLocation === undefined
    //         ? undefined
    //         : {
    //             [this.visitorAttr]: visitor,
    //             [this.locationAttr]: lastLocation,
    //           },
    //   };
  
    //   const items: Visit[] = [];
    //   const data = await this.client.send(new QueryCommand(params));
    //   const hasMorePages = data.LastEvaluatedKey !== undefined;
    //   data.Items?.forEach((item) =>
    //     items.push(
    //       new Visit(
    //         item[this.visitorAttr],
    //         item[this.locationAttr],
    //         item[this.visitCountAttr]
    //       )
    //     )
    //   );
    //   return new DataPage<Visit>(items, hasMorePages);
    // }
  
    // /**
    //  * Fetch the next page of visitors who have visited location
    //  *
    //  * @param location The location of interest
    //  * @param lastVisitor The last visitor returned in the previous page of results
    //  * @param limit The maximum number of visitors to include in the result
    //  * @return The next page of visitors who have visited location
    //  */
    // async getVisitors(
    //   location: string,
    //   lastVisitor: string | undefined = undefined,
    //   limit: number = 2
    // ): Promise<DataPage<Visit>> {
    //   const params = {
    //     KeyConditionExpression: this.locationAttr + " = :loc",
    //     ExpressionAttributeValues: {
    //       ":loc": location,
    //     },
    //     TableName: this.tableName,
    //     IndexName: this.indexName,
    //     Limit: limit,
    //     ExclusiveStartKey:
    //       lastVisitor === undefined
    //         ? undefined
    //         : {
    //             [this.visitorAttr]: lastVisitor,
    //             [this.locationAttr]: location,
    //           },
    //   };
  
    //   const items: Visit[] = [];
    //   const data = await this.client.send(new QueryCommand(params));
    //   const hasMorePages = data.LastEvaluatedKey !== undefined;
    //   data.Items?.forEach((item) =>
    //     items.push(
    //       new Visit(
    //         item[this.visitorAttr],
    //         item[this.locationAttr],
    //         item[this.visitCountAttr]
    //       )
    //     )
    //   );
  
    //   return new DataPage<Visit>(items, hasMorePages);
    // }
  
    private generateVisitItem(follows: follows) {
      return {
        [this.followerAttr]: follows._follower_handle,
        [this.followeeAttr]: follows._followee_handle,
      };
    }
  }