import { anything, capture, instance, mock, spy, verify , when} from "ts-mockito";
import {PostStatusPresenter, PostStatusView} from "../../../src/presenter/PostStatusPresenter"
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";



describe("PostStatusPresenter", () =>{
    let postStatusPresenter: PostStatusPresenter;
    let mockPostStatusView: PostStatusView;
    const authToken = new AuthToken("abc123", Date.now())
    const user = new User("John", "Tappen", "jtappen", "abc123");
    const status =  new Status("This is the post", user, Date.now());
    let mockStatusService: StatusService;


    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(PostStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(PostStatusPresenterSpy.postService).thenReturn(mockStatusServiceInstance);
    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost("This is a post", user, authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...",0)).once();
        // verify(mockPostStatusView.displayInfoMessage("Status posted!",2000)).once();
    })
    
    it("calls postStatus on the post status service with the correct status string and auth token", async () =>{
        await postStatusPresenter.submitPost("This is the post", user, authToken);
        verify(mockStatusService.postStatus(anything(), anything())).once()

        let [captureAuthtoken, captureStatus] =  capture(mockStatusService.postStatus).first();
        expect(captureAuthtoken).toEqual(authToken);
        expect(captureStatus.user).toEqual(status.user);
        expect(captureStatus.post).toEqual(status.post);

        
    })
    it("the presenter tells the view to clear the last info message, clear the post, and display a status posted message", async()=>{
        await postStatusPresenter.submitPost("This is the post", user, authToken);
        
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.setPost("")).once()

    })  
    it("posting of the status is not successful, the presenter tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message.", async () => {
        const error  = Error("An error occurred");
        when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

        await postStatusPresenter.submitPost("This is the post", user, authToken);

        //  let [captureErrorMessage] =  capture(mockPostStatusView.displayErrorMessage).first();
        // console.log(captureErrorMessage);

        
        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();

        verify(mockPostStatusView.clearLastInfoMessage()).never();
        verify(mockPostStatusView.setPost(anything())).never()
        verify(mockPostStatusView.displayInfoMessage(anything(), anything())).once();
        //Double check this, its cuz it calls it once before it calls submit post



    })

})