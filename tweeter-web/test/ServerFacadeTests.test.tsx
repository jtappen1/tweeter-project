import { AuthToken, GetFollowersCountRequest, GetIsFollowerStatusRequest, LoginRequest, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../src/model/service/net/ServerFacade";
import "isomorphic-fetch";


let serverFacade: ServerFacade;
const authToken: AuthToken = new AuthToken("Auth", 10);
const user: User = new User("John", "Tappen", "jtappen","password");


describe("Server Facade tests", () =>{
    beforeAll(() => {
        serverFacade = new ServerFacade()
    })

    // test("Register", async ()=>{
    //     const request = new RegisterRequest("John", "Tappen", "jtappen","Password",new Uint8Array())
    //     const response = await serverFacade.register(request);
    //     expect(response.user).toBeDefined();
    //     expect(response.token).toBeDefined();
    //     expect(response._message).toBeDefined();
    // })

    test("Login", async ()=>{
        const request = new LoginRequest("@john", "john");
        const response = await serverFacade.login(request);
        
        expect(response.user.alias).toEqual("@john");
        expect(response.token).toBeDefined();
        expect(response._message).toBeDefined();

    })

    // test("GetFollowersCount", async ()=>{
    //     const request = new GetFollowersCountRequest(authToken, user);
    //     const response = await serverFacade.getFollowersCount(request);
    //     expect(response._success).toBe(true)
    //     expect(response._message).toBeDefined();
    // })
    // test("GetFollowers", async () => {
    //     const request = new GetIsFollowerStatusRequest(authToken, user, new User("james", "can", "fas", "loop"));
    //     const response = await serverFacade.getIsFollowerStatus(request);
    //     expect(response._success).toBe(true)
    //     expect(response._message).toBeDefined();
    //     expect(response._isFollower).toBeDefined();
    // })

})