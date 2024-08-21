"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { weeklyChart } from "./weekly-chart";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPrice } from "@/lib/format-price";
import { monthlyChart } from "./monthly-chart";
export default function Revenue({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || " week";

  const chartItems = totalOrders.map((order) => ({
    date: order.orders.created!,
    revenue: order.orders.total,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);
    if (filter === "week") {
      return weekly;
    }
    if (filter === "month") {
      return monthly;
    }
  }, [filter]);

  const activeRevenue = useMemo(() => {
    if (filter === "month") {
      return formatPrice(
        monthlyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0)
      );
    }
    return formatPrice(
      weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0)
    );
  }, [filter]);

  return (
    <Card className="flex-1 shrink-0 h-full ">
      <CardHeader>
        <CardTitle> Your Revenue: {activeRevenue} </CardTitle>
        <CardDescription> Here are your recent revenue </CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
          >
            {" "}
            This week{" "}
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
          >
            {" "}
            This month{" "}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={activeChart}>
            <Tooltip
              content={(props) => (
                <div>
                  {props.payload?.map((item) => (
                    <div
                      className="px-2 py-4 bg-primary rounded-md shadow-lg  "
                      key={item.payload.date}
                    >
                      <p>Revenue: {formatPrice(+item.value!)}</p>
                      <p>Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey={"revenue"} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
