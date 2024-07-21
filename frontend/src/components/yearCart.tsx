import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SubscriptionEx } from "@/types";

const processChartData = (
  data: {
    app: string;
    price: number;
    fill: string;
  }[]
) => {
  // 上位5つを抽出
  const top5 = data.slice(0, 5);
  const others = data.slice(5);

  // その他の項目を計算
  const othersValue = others.reduce((sum, item) => sum + item.price, 0);

  top5.forEach((item, index) => {
    item.fill = `var(--color-${index + 1})`;
  });

  // その他の項目を追加
  if (othersValue > 0) {
    top5.push({ app: "Other", price: othersValue, fill: `var(--color-6)` });
  }
  console.log(top5);
  return top5;
};

const chartDataFn = (subscriptions: SubscriptionEx[]) => {
  const data = subscriptions.map((subscription) => {
    return {
      app: subscription.AppName,
      price:
        subscription.Interval === "month"
          ? calculateMonthlySubscriptionAmount(subscription)
          : calculateYearlySubscriptionAmount(subscription),
      fill: ``,
    };
  });
  const sortedData = [...data].sort((a, b) => b.price - a.price);

  return { sortedData };
};

function calculateMonthlySubscriptionAmount(subscription: SubscriptionEx) {
  const start = new Date(subscription.StartDate);
  const now = new Date();
  const currentYear = now.getFullYear();

  // 今年の1月1日から12月31日までの期間を設定
  const startMonth = new Date(currentYear, 0, 1);
  const endMonth = new Date(currentYear, 11, 31);

  // サブスクリプションの開始日が今年の1月1日よりも遅い場合は、開始日から計算
  const effectiveStart = start > startMonth ? start : startMonth;
  // サブスクリプションの終了日が今年の12月31日よりも早い場合は、終了日まで計算
  const effectiveEnd = subscription.Period
    ? new Date(start.setMonth(start.getMonth() + subscription.Period))
    : endMonth;
  const validEnd = effectiveEnd < endMonth ? effectiveEnd : endMonth;

  // 計算する月数
  const months = Math.max(
    0,
    (validEnd.getFullYear() - effectiveStart.getFullYear()) * 12 +
      validEnd.getMonth() -
      effectiveStart.getMonth() +
      1
  );

  return months * subscription.Price;
}

function calculateYearlySubscriptionAmount(subscription: SubscriptionEx) {
  const start = new Date(subscription.StartDate);
  const now = new Date();
  const currentYear = now.getFullYear();
  const paymentMonth = subscription.Payment; // 支払いが発生する月（1-12）

  // 今年の1月1日から12月31日までの期間を設定
  const startMonth = new Date(currentYear, 0, 1);
  const endMonth = new Date(currentYear, 11, 31);

  // サブスクリプションが今年も続いているかどうかを確認
  const effectiveStart = start > startMonth ? start : startMonth;
  const effectiveEnd = subscription.Period
    ? new Date(
        start.setFullYear(
          start.getFullYear() + Math.floor(subscription.Period / 12)
        )
      )
    : endMonth;

  // 支払いが今年行われるかどうかを確認
  const paymentThisYear =
    paymentMonth >= 1 &&
    paymentMonth <= 12 &&
    effectiveEnd.getFullYear() === currentYear;

  // 今年の支払い対象月数がある場合は、その金額を返す
  return paymentThisYear ? subscription.Price : 0;
}

interface ChartType {
  app: string;
  price: number;
}
interface ChartItem {
  label: string;
  color?: string;
}

interface ChartConfigType {
  price: {
    label: string;
  };
  [key: string]: ChartItem | { label: string }; // 追加したプロパティの型を指定
}

const YearCart = ({ subscriptions }: { subscriptions: SubscriptionEx[] }) => {
  const { sortedData } = chartDataFn(subscriptions);
  const [chart, setChart] = useState<ChartType[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfigType | null>(null);

  const totalPrice = useMemo(() => {
    return chart.reduce((acc, curr) => acc + curr.price, 0);
  }, [chart]);

  useEffect(() => {
    if (sortedData.length > 5) {
      const processedChart = sortedData ? processChartData(sortedData) : [];
      setChart(processedChart);
    } else {
      sortedData.forEach((item, index) => {
        item.fill = `var(--color-${index + 1})`;
      });
      setChart(sortedData);
    }
  }, [subscriptions]);

  useEffect(() => {
    if (chart.length > 0) {
      const generateChartConfig = () => {
        const config: ChartConfigType = {
          price: {
            label: "Price",
          },
        };

        for (let i = 0; i < chart.length; i++) {
          config[(i + 1).toString()] = {
            label: chart[i].app,
            color: `hsl(var(--chart-${i + 1}))`,
          };
        }

        setChartConfig(config);
      };

      generateChartConfig();
    }
  }, [chart]);

  if (!chartConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>今年の支払額予想</CardTitle>
          <CardDescription>
            January - December {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chart}
                dataKey="price"
                nameKey="app"
                innerRadius={"50%"}
                startAngle={90}
                endAngle={-270}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl lg:text-3xl font-bold"
                          >
                            {totalPrice.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            円
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearCart;
