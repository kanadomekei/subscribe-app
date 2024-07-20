import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ListCard from "./listCard";
import { Link } from "react-router-dom";
import { Subscription, SubscriptionEx } from "@/types";
import { Subscriptions } from "@/sample/subscription";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "./authProvider";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

async function getSubscription(userId: number): Promise<SubscriptionEx[]> {
  const url = `${API_URL}/app/all?user_id=${userId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const List = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  if (!user) {
    return;
  }
  const {
    data: subscriptions,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscription(user.id),
  });

  if (isPending) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">something went wrong</div>;
  }

  console.log(subscriptions);

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
          {subscriptions.map((subscription: SubscriptionEx, index) => (
            <ListCard key={index} props={subscription} deleteFn={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
