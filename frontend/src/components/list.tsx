import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ListCard from "./listCard";
import { Link } from "react-router-dom";
import { Subscription } from "@/types";
import { Subscriptions } from "@/sample/subscription";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

async function getSubscription(): Promise<Subscription[]> {
  // const url = `${API_URL}/app/all?user_id=1`;
  const res = Subscriptions;
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }
  return res;
}

const List = () => {
  const {
    data: subscriptions,
    isPending,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscription,
  });

  if (isPending) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">something went wrong</div>;
  }

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
      {subscriptions.length === 0 ? (
        <div>使っているサブスクを追加してみよう</div>
      ) : (
        <div
          className={
            subscriptions.length >= 3
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }
        >
          {subscriptions.map((subscription: Subscription) => (
            <ListCard key={subscription.id} props={subscription} />
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
