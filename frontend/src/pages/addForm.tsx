import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SubscriptionForm from "@/components/subscriptionForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/authProvider";
import { useNavigate } from "react-router-dom";
import { FormValue } from "@/types";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

const AddForm = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [period, setPeriod] = useState<number>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (values: FormValue) => {
    if (values !== undefined) {
      if (values.period === "") {
        setPeriod(undefined);
      } else {
        setPeriod(values.period);
      }
    }

    try {
      const response = await fetch(`${API_URL}/app/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("accessToken")}`,
          "refreshToken": `${localStorage.getItem("refreshToken")}`,
        },
        body: JSON.stringify({
          AppName: values.appName,
          Price: values.price,
          Interval: values.interval,
          Payment: values.payment,
          Period: period,
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
