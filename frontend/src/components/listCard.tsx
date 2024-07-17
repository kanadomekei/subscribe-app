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
import { Subscription } from "./list";

const ListCard = ({ props }: { props: Subscription }) => {
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
              ? "毎月" + props.paymentDate + "日"
              : "毎年" + props.paymentDate + "月"}
          </p>
          <p>
            <span>金額 : </span>
            {props.price}円
          </p>
          <p>
            <span>期間 : </span>
            {props.period.startMonth + "~"}
            {props.period.endMonth === "current" ? "" : props.period.endMonth}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCard;
