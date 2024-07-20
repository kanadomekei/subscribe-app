import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SubscriptionForm from "@/components/subscriptionForm";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/authProvider";
import { Subscription } from "@/types";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

type FormValue = {
  startMonth: Date;
  appName: string;
  link: string;
  price: number | "";
  interval: "month" | "year";
  payment: string;
  current: boolean;
  endMonth?: Date | undefined;
};

const AddForm = () => {
  const { user } = useContext(AuthContext);
  const [period, setPeriod] = useState<number>();
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValue) => {
    if (values.endMonth) {
      setPeriod(
        Math.floor(
          (values.endMonth.getTime() - values.startMonth.getTime()) /
            1000 /
            60 /
            60 /
            24 /
            30
        )
      );
    } else {
      setPeriod(-1);
    }

    try {
      const response = await fetch(`${API_URL}/app/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: 1,
          AppName: values.appName,
          Price: values.price,
          Interval: values.interval,
          Payment: values.payment,
          Period: null,
          StartDate: values.startMonth,
          Url: values.link,
        }),
      });
      const data = await response.json();
      console.log("Response data:", data);
      if (data.message === "Subscription created successfully") {
        console.log(data);
        navigate("/");
      } else {
        console.error("追加失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div className="container my-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">サブスク追加</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SubscriptionForm handleSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddForm;
