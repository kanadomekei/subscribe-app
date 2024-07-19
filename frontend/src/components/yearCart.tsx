import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Subscriptions } from "@/sample/subscription";

const data = Subscriptions.map((subscription) => {
  return {
    app: subscription.appName,
    price: subscription.price,
    fill: `var(--color-${subscription.id})`,
  };
});

// const chartData = [
//   { app: "spotify", price: 980, fill: "var(--color-spotify)" },
//   { app: "chatGPT", price: 3040, fill: "var(--color-chatGPT)" },
//   {
//     app: "amazonPrimeVideo",
//     price: 600,
//     fill: "var(--color-amazonPrimeVideo)",
//   },
//   { app: "kindleUnlimited", price: 980, fill: "var(--color-kindleUnlimited)" },
//   { app: "other", price: 190, fill: "var(--color-other)" },
// ];
const sortedData = [...data].sort((a, b) => b.price - a.price);

const chartConfig = {
  price: {
    label: "Price",
  },
  1: {
    label: data[0].app,
    color: "hsl(var(--chart-1))",
  },
  2: {
    label: data[1].app,
    color: "hsl(var(--chart-2))",
  },
  3: {
    label: data[2].app,
    color: "hsl(var(--chart-3))",
  },
  4: {
    label: data[3].app,
    color: "hsl(var(--chart-4))",
  },
  5: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const YearCart = () => {
  const totalPrice = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.price, 0);
  }, []);

  return (
    <div>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Total Price</CardTitle>
          <CardDescription>January - December 2024</CardDescription>
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
                data={sortedData}
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
