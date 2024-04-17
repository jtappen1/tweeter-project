import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../src/model/service/StatusService";
import "isomorphic-fetch";

describe("Story tests", () =>{
    let statusServiceTest: StatusService;
    beforeAll(() =>{
        statusServiceTest = new StatusService();
    })
    test("loadStoryPages", async () =>{
        // const authToken = new AuthToken("aaaa", 100);
        // const user = new User("asasdasf", "asdfa", "asdfasfd", "asdfaaf");
        // const lastItem = new Status("asdfaf", user, 1000);
        // const [storyPage, hasMoreItems] = await  statusServiceTest.loadMoreStoryItems(authToken, user, 10, lastItem);
        // expect(storyPage.length).toBeGreaterThan(1);
        // expect(storyPage).toBeDefined();
        // expect(hasMoreItems).toBeDefined();
        
    })
})