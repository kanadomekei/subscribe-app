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

const chartData = [
  { app: "spotify", price: 980, fill: "var(--color-spotify)" },
  { app: "chatGPT", price: 3040, fill: "var(--color-chatGPT)" },
  {
    app: "amazonPrimeVideo",
    price: 600,
    fill: "var(--color-amazonPrimeVideo)",
  },
  { app: "kindleUnlimited", price: 980, fill: "var(--color-kindleUnlimited)" },
  { app: "other", price: 190, fill: "var(--color-other)" },
];
const sortedData = [...chartData].sort((a, b) => b.price - a.price);

const chartConfig = {
  price: {
    label: "Price",
  },
  spotify: {
    label: "Spotify",
    color: "hsl(var(--chart-1))",
  },
  chatGPT: {
    label: "chatGPT",
    color: "hsl(var(--chart-2))",
  },
  amazonPrimeVideo: {
    label: "AmazonPrimeVideo",
    color: "hsl(var(--chart-3))",
  },
  kindleUnlimited: {
    label: "KindleUnlimited",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const YearCart = () => {
  const totalPrice = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.price, 0);
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
                            className="fill-foreground text-3xl font-bold"
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
