import { Status } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/StatusItem";
import { useContext } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props{
    // loadMoreFeedItems: (
    //     authToken: AuthToken,
    //     user: User,
    //     pageSize: number,
    //     lastItem: Status | null
    //   ) => Promise<[Status[], boolean]>;
    presenterGenerator:(view:StatusItemView) => StatusItemPresenter;

}

const StatusItemScroller = (props: Props) => {
    const [items, setItems] = useState<Status[]>([]);
    const itemsReference = useRef(items);
    itemsReference.current = items;
    // const addItems = (newItems: Status[]) =>
    // setItems([...itemsReference.current, ...newItems]);

    const { displayErrorMessage } = useToastListener();
    // const [hasMoreItems, setHasMoreItems] = useState(true);
    // const [lastItem, setLastItem] = useState<Status | null>(null);

    const listener: StatusItemView = {
      addItems : (newItems: Status[]) =>
      setItems([...itemsReference.current, ...newItems]),
      displayErrorMessage: displayErrorMessage
    }
    const [presenter] = useState(props.presenterGenerator(listener));

    const { displayedUser, authToken } = useUserInfo();

    useEffect(() => {
        loadMoreItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


    const loadMoreItems = async () => {
        presenter.loadMoreItems(authToken!, displayedUser!);
    };
    


    return(
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem value = {item}/>
          </div>
        ))}
      </InfiniteScroll>
    </div>)


}

export default StatusItemScroller;