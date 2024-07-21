import {
  DotsVerticalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionEx } from "@/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

const ListCard = ({
  props,
  deleteFn,
}: {
  props: SubscriptionEx;
  deleteFn: () => void;
}) => {
  const [endMonth, setEndMonth] = useState(new Date(props.StartDate));

  useEffect(() => {
    if (props.Period !== 0) {
      const updatedDate = new Date(endMonth); // 新しいDateオブジェクトを作成
      updatedDate.setMonth(updatedDate.getMonth() + props.Period);
      setEndMonth(updatedDate); // 新しいDateオブジェクトをsetEndMonthに渡す
    }
  }, []);

  const id = props.ID;
  const handleDelete = async (id: number) => {
    if (confirm("本当に削除しますか？")) {
      const url = `${API_URL}/app/delete/${id}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      deleteFn();
      return res.json();
    }
  };

  return (
    <div>
      <Card className="border-border h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            {props.AppName}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DotsVerticalIcon className="stroke-primary h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to={`/${props.ID}/edit`}>
                    <Pencil2Icon className="mr-1 h-4 w-4" />
                    編集
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(id)}>
                  <TrashIcon className="mr-1 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription className="hover:underline break-all truncate">
            <a href={props.Url} target="_blank" rel="noopener noreferrer">
              {props.Url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base">
          <p>
            <span>支払日 : </span>
            {props.Interval === "month"
              ? "毎月" + props.Payment + "日"
              : "毎年" + props.Payment + "月"}
          </p>
          <p>
            <span>金額 : </span>
            {props.Price}円
          </p>
          <p>
            <span>期間 : </span>
            {format(new Date(props.StartDate), "yyy/MM", { locale: ja }) +
              " ~ "}
            {props.Period === 0
              ? ""
              : format(endMonth, "yyy/MM", { locale: ja })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCard;
