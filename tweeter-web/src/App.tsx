import "./App.css";
import { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowerPresenter } from "./presenter/FollowersPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  
  // const loadMoreStoryItems = async (
  //   authToken: AuthToken,
  //   user: User,
  //   pageSize: number,
  //   lastItem: Status | null
  // ): Promise<[Status[], boolean]> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  // };

  // const loadMoreFeedItems = async (
  //   authToken: AuthToken,
  //   user: User,
  //   pageSize: number,
  //   lastItem: Status | null
  // ): Promise<[Status[], boolean]> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  // };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route path="feed" element={<StatusItemScroller presenterGenerator={(view:StatusItemView) => new FeedPresenter(view)} />} />
        <Route path="story" element={<StatusItemScroller presenterGenerator={(view:StatusItemView) => new StoryPresenter(view)} />} />
        <Route
          path="following"
          element={
            <UserItemScroller
            presenterGenerator = {(view:UserItemView) => new FollowingPresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
            presenterGenerator = {(view:UserItemView) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
