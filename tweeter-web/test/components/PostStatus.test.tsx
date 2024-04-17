
import PostStatus from "../../src/components/postStatus/PostStatus"
import { render, screen} from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { anything, capture, instance, mock, spy, verify , when} from "ts-mockito";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../src/components/userInfo/UserInfoHook";

jest.mock("../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
  })); 

describe("PostStatus Component", () =>{

    beforeAll(()=>{
        const mockUser = mock<User>();
        const mockUserInstance = instance(mockUser);
        const mockAuthToken = mock<AuthToken>();
        const mockAuthTokenInstance = instance(mockAuthToken);
    
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
          });   
    })
    it("first rendered the Post Status and Clear buttons are both disabled", () => {
        const {postStatusButton, clearStatusButton}= renderPostAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    })
    it("Both buttons are enabled when the text field has text", async () =>{
        const {postStatusButton, clearStatusButton, postStatusTextField, user}= renderPostAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();

        await user.type(postStatusTextField, "banana");

        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();
    })
    it("Both buttons are disabled when the text field is cleared.", async ()=> {
        const {postStatusButton, clearStatusButton, postStatusTextField, user}= renderPostAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();

        await user.type(postStatusTextField, "a");
        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();

        await user.clear(postStatusTextField);
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    })
    it("presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () =>{
        
        const mockPostStatusPresenter = mock<PostStatusPresenter>();

        const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);
        const {postStatusButton, clearStatusButton, postStatusTextField, user}= renderPostAndGetElements(mockPostStatusPresenterInstance);
        await user.type(postStatusTextField,"banana");

        await user.click(postStatusButton);
        verify(mockPostStatusPresenter.submitPost("banana", anything(), anything())).once();

    })
})

const renderPost = (presenter?:PostStatusPresenter) =>{
    return render(
        <> {!! presenter ? <PostStatus  presenter={presenter} /> 
        : 
        <PostStatus/>

        }</>);
}

const renderPostAndGetElements =  (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();
    renderPost(presenter);
    const postStatusButton = screen.getByLabelText("postbtn")
    const clearStatusButton = screen.getByLabelText("clearbtn")
    const postStatusTextField = screen.getByLabelText("postTextField")
    return {postStatusButton,clearStatusButton, postStatusTextField, user};
}
