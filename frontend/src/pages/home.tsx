import { AuthContext } from "@/components/authProvider";
import List from "@/components/list";
import YearCart from "@/components/yearCart";
import { SubscriptionEx } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

async function getAllSubscriptions(): Promise<SubscriptionEx[]> {
  const url = `${API_URL}/app/all`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("accessToken")}`,
      refreshToken: `${localStorage.getItem("refreshToken")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return;
  }
  const {
    data: subscriptions,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getAllSubscriptions(),
  });

  if (isPending) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div className="error">something went wrong</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 container my-10 md:gap-10 gap-y-10">
        <YearCart subscriptions={subscriptions} />
        <div className="col-span-2">
          <List subscriptions={subscriptions} deleteFn={refetch} />
        </div>
      </div>
    </div>
  );
};

export default Home;
