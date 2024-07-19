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
import { Subscription } from "@/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";

const ListCard = ({ props }: { props: Subscription }) => {
  const [endMonth, setEndMonth] = useState(new Date(props.startMonth));

  useEffect(() => {
    if (props.period !== -1) {
      const updatedDate = new Date(endMonth); // 新しいDateオブジェクトを作成
      updatedDate.setMonth(updatedDate.getMonth() + props.period);
      setEndMonth(updatedDate); // 新しいDateオブジェクトをsetEndMonthに渡す
    }
  }, [props.period, props.startMonth]);

  return (
    <div>
      <Card className="border-border h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            {props.appName}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DotsVerticalIcon className="stroke-primary h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Pencil2Icon className="mr-1 h-4 w-4" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrashIcon className="mr-1 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription className="hover:underline break-all truncate">
            <a href={props.link} target="_blank" rel="noopener noreferrer">
              {props.link}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base">
          <p>
            <span>支払日 : </span>
            {props.interval === "month"
              ? "毎月" + props.payment + "日"
              : "毎年" + props.payment + "月"}
          </p>
          <p>
            <span>金額 : </span>
            {props.price}円
          </p>
          <p>
            <span>期間 : </span>
            {format(props.startMonth, "yyy/MM", { locale: ja }) + " ~ "}
            {props.period === -1
              ? ""
              : format(endMonth, "yyy/MM", { locale: ja })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCard;
