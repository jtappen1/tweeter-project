import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import { PageItemView, PagedItemPresenter } from "../../presenter/PagedItemPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

interface Props<T,U>{
    presenterGenerator:(view:PageItemView<T>) => PagedItemPresenter<T, U>;
    itemComponentGenerator:(item: T) => JSX.Element;
}

const ItemScroller = <T,U>(props: Props<T,U>) => {
    const [items, setItems] = useState<T[]>([]);
    const itemsReference = useRef(items);
    itemsReference.current = items;
    // const addItems = (newItems: Status[]) =>
    // setItems([...itemsReference.current, ...newItems]);

    const { displayErrorMessage } = useToastListener();
    // const [hasMoreItems, setHasMoreItems] = useState(true);
    // const [lastItem, setLastItem] = useState<Status | null>(null);

    const listener: PageItemView<T> = {
      addItems : (newItems: T[]) =>
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
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>)
}

export default ItemScroller;