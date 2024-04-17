import { mock, instance, spy, when, verify, capture, anything } from "ts-mockito";
import { AuthToken, User, Status, LoginRequest, PostStatusRequest, LoadMoreStatusItemsRequest } from "tweeter-shared";
import { StatusService } from "../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../src/presenter/PostStatusPresenter";
import { ServerFacade } from "../src/model/service/net/ServerFacade";
import "isomorphic-fetch";

describe("PostStatusPresenter", () =>{
    let postStatusPresenter: PostStatusPresenter;
    let mockPostStatusView: PostStatusView;
    const authToken = new AuthToken("abc123", Date.now())
    const user = new User("@john", "john", "tappen", "john");
    const status =  new Status("This is the post", user, Date.now());
    let mockStatusService: StatusService;
    const serverFacade = new ServerFacade()


    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(PostStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);
        

        when(PostStatusPresenterSpy.postService).thenReturn(mockStatusServiceInstance);
    })
    test("Login", async ()=>{
        const request = new LoginRequest("@john", "john");
        const response = await serverFacade.login(request);
        expect(response.user).toBeDefined();
        expect(response.token).toBeDefined();
        expect(response._message).toBeDefined();

    })
    it("Post a status from the user to the server by calling the post status operation on the relevant Presenter", async () => {
        await postStatusPresenter.submitPost("This is a post", user, authToken);
        let [captureMessage] = capture(mockPostStatusView.displayInfoMessage).second();
        console.log("Capture Message: " + captureMessage);
        
        expect(captureMessage).toEqual("Status posted!")
        verify(mockPostStatusView.displayInfoMessage(anything(),anything())).twice();
        
        // verify(mockPostStatusView.displayInfoMessage("Successfully Posted!",0)).once();
        // verify(mockPostStatusView.displayInfoMessage("Status posted!",2000)).once();
    })
    it("Retrieve the user's story from the server to verify that the new status was correctly appended to the user's story, and that all status details are correct. [This can be done by directly accessing the ServerFacade or client side service class]",  async () => {
        const request = new LoginRequest("@john", "john");
        const response = await serverFacade.login(request);
        expect(response.user).toBeDefined();
        expect(response.token).toBeDefined();
        expect(response._message).toBeDefined();
        
        const status = new Status("TEST STATUS", response._user, Date.now());
        const postRequest  = new PostStatusRequest(response._token,status)
        await serverFacade.postStatus(postRequest)

        let authRequest = new LoadMoreStatusItemsRequest(response._token, response._user, 1, null);
        let resp =await serverFacade.loadMoreStoryItems(authRequest);
    
       expect(resp._items[0].at(0)?.post).toEqual(status.post);

    })
    // it("calls postStatus on the post status service with the correct status string and auth token", async () =>{
    //     await postStatusPresenter.submitPost("This is the post", user, authToken);
    //     verify(mockStatusService.postStatus(anything(), anything())).once()

    //     let [captureAuthtoken, captureStatus] =  capture(mockStatusService.postStatus).first();
    //     expect(captureAuthtoken).toEqual(authToken);
    //     expect(captureStatus.user).toEqual(status.user);
    //     expect(captureStatus.post).toEqual(status.post);

        
    // })
})