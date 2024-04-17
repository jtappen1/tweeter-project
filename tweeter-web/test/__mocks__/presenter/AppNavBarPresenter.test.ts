import { AuthToken } from "tweeter-shared";
import { LogoutPresenter,LogoutView} from "../../../src/presenter/LogoutPresenter";
import { anything, capture, instance, mock, spy, verify , when} from "ts-mockito";
import { UserService } from "../../../src/model/service/UserService";
describe("AppNavBarPresenter", () => {
    let mockAppNavBarPresenterView: LogoutView;
    let appNavBarPresenter: LogoutPresenter;
    const authToken = new AuthToken("abc123", Date.now())
    let mockUserService: UserService;

    beforeEach(()=>{
        mockAppNavBarPresenterView = mock<LogoutView>();
        const mockAppNavBarPresenterViewInstance = instance(mockAppNavBarPresenterView);
        // appNavBarPresenter = new LogoutPresenter(mockAppNavBarPresenterViewInstance);

        const AppNavBarPresenterSpy = spy(new LogoutPresenter(mockAppNavBarPresenterViewInstance));
        appNavBarPresenter = instance(AppNavBarPresenterSpy);
        
        mockUserService = mock<UserService>();
        const mockUserServiceInstance =  instance(mockUserService);

        when(AppNavBarPresenterSpy.userService).thenReturn(mockUserServiceInstance)

    })

    it("tells the view to display a logging out message", async () => {
       await appNavBarPresenter.logOut(authToken)
       verify(mockAppNavBarPresenterView.displayInfoMessage("Logging Out...",0)).once();
    })

    it("calls logout on the userService", async () =>{
        await appNavBarPresenter.logOut(authToken)
        verify(mockUserService.logout(anything())).once();

        let [captureAuthtoken] =  capture(mockUserService.logout).last();
        expect(captureAuthtoken).toEqual(authToken) ;


    })
    it("tells the view to clear the last info message, clear the post, and display a status posted message", async ()=>{
        await appNavBarPresenter.logOut(authToken);
        verify(mockAppNavBarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavBarPresenterView.clearUserInfo()).once();
        verify(mockAppNavBarPresenterView.navigateToLogin()).once();
    })
    it("it displays an error message and does not clear the last info message, clear the post, and display a status posted message", async ()=>{
        const error  = Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);
        await appNavBarPresenter.logOut(authToken);
        // let [captureErrorMessage] =  capture(mockAppNavBarPresenterView.displayErrorMessage).last();
        // console.log(captureErrorMessage);
        
        verify(mockAppNavBarPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();

        verify(mockAppNavBarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavBarPresenterView.clearUserInfo()).never();
        verify(mockAppNavBarPresenterView.navigateToLogin()).never();

    })
});