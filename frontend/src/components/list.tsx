import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ListCard from "./listCard";
import { Link } from "react-router-dom";
import { SubscriptionEx } from "@/types";

const List = ({
  subscriptions,
  deleteFn,
}: {
  subscriptions: SubscriptionEx[];
  deleteFn: () => void;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">サブスク一覧</h1>
        <Button size="icon" className="rounded-full" asChild>
          <Link to={"/add"}>
            <PlusIcon className="h-4 w-4 stroke-background" />
          </Link>
        </Button>
      </div>
      {!subscriptions ? (
        <div>使っているサブスクを追加してみよう</div>
      ) : (
        <div
          className={
            subscriptions.length >= 3
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }
        >
          {subscriptions.map((subscription: SubscriptionEx, index) => (
            <ListCard key={index} props={subscription} deleteFn={deleteFn} />
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
