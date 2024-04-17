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
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowerPresenter } from "./presenter/FollowersPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { PageItemView, PagedItemPresenter } from "./presenter/PagedItemPresenter";
import UserItem from "./components/userItem/UserItem";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";

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
  
  const userItem = (user:User) => <UserItem value={user}/>
  const statusItem = (status:Status) => <StatusItem value={status}/>

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route path="feed" element={
          
        
        <ItemScroller key = {'feed'} presenterGenerator={(view:PageItemView<Status>) => new FeedPresenter(view)} itemComponentGenerator={statusItem}/>
      }/>
        <Route path="story" element={
       
        <ItemScroller key = {'story'} presenterGenerator={(view:PageItemView<Status>) => new StoryPresenter(view)} itemComponentGenerator={statusItem}/>
        } />
        <Route
          path="following"
          element={
            <ItemScroller key = {'following'} presenterGenerator={(view:PageItemView<User>) => new FollowingPresenter(view)} itemComponentGenerator={userItem}/>
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller key = {'follower'} presenterGenerator={(view:PageItemView<User>) => new FollowerPresenter(view)} itemComponentGenerator={userItem}/>
            
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
