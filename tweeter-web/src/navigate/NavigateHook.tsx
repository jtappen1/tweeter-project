
import useUserInfo from "../components/userInfo/UserInfoHook";
import useToastListener from "../components/toaster/ToastListenerHook";
import { useState } from "react";
import { NavigatePresenter, NavigateView } from "../presenter/NavigatePresenter";

const useNavigateHook = () => {

    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();

    const listener: NavigateView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage
    }

    const [presenter] = useState(new NavigatePresenter(listener))

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        console.log("Getting to Navigate");
        presenter.navigate(authToken, currentUser, event.target.toString());
        
    };

      return navigateToUser;

}

export default useNavigateHook;