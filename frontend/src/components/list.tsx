import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import ListCard from "./listCard";
import { Link } from "react-router-dom";

export type Subscription = {
  id: number;
  appName: string;
  link: string;
  price: number;
  interval: "month" | "year";
  paymentDate: string;
  period: {
    startMonth: string;
    endMonth: string | "current";
  };
};

const data: Subscription[] = [
  {
    id: 1,
    appName: "Spotify",
    link: "https://open.spotify.com/intl-ja",
    price: 480,
    interval: "month",
    paymentDate: "15",
    period: {
      startMonth: "2024/7",
      endMonth: "current",
    },
  },
  {
    id: 2,
    appName: "Netflix",
    link: "https://www.netflix.com/",
    price: 790,
    interval: "year",
    paymentDate: "2",
    period: {
      startMonth: "2024/2",
      endMonth: "2024/7",
    },
  },
  {
    id: 3,
    appName: "Amazon Prime Video",
    link: "https://www.amazon.co.jp/gp/video/storefront",
    price: 790,
    interval: "year",
    paymentDate: "2",
    period: {
      startMonth: "2024/2",
      endMonth: "2024/7",
    },
  },
  {
    id: 4,
    appName: "KindleUnlimited",
    link: "https://www.amazon.co.jp/gp/video/storefront",
    price: 790,
    interval: "year",
    paymentDate: "2",
    period: {
      startMonth: "2024/2",
      endMonth: "current",
    },
  },
];

const List = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">サブスク一覧</h1>
        <Button size="icon" className="rounded-full" asChild>
          <Link to={"/create"}>
            <PlusIcon className="h-4 w-4 stroke-background" />
          </Link>
        </Button>
      </div>
      {data.length === 0 ? (
        <div>使っているサブスクを追加してみよう</div>
      ) : (
        <div
          className={
            data.length >= 3
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }
        >
          {data.map((subscription) => (
            <ListCard key={subscription.id} props={subscription} />
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
