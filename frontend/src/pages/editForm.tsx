import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionForm from "@/components/subscriptionForm";
import { FormValue, SubscriptionEx } from "@/types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/authProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080";

async function getSubscription(id: string): Promise<SubscriptionEx> {
  const url = `${API_URL}/app/${id}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${localStorage.getItem("accessToken")}`,
      "refreshToken": `${localStorage.getItem("refreshToken")}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const EditForm = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [period, setPeriod] = useState<number>();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    return navigate("/");
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const {
    data: subscription,
    isPending,
    error,
  } = useQuery({
    queryKey: ["subscription", id],
    queryFn: () => getSubscription(id),
    enabled: !!id, // ID がある場合にのみフェッチを有効化
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の再フェッチを無効化
  });

  if (isPending) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">something went wrong</div>;
  }

  const handleSubmit = async (values: FormValue) => {
    if (values) {
      if (values.period === "") {
        setPeriod(undefined);
      } else {
        setPeriod(values.period);
      }
    }

    try {
      const response = await fetch(`${API_URL}/app/update/${id}`, {
        method: "PUT",
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
      if (data.message === "Subscription updated successfully") {
        console.log(data);
        navigate("/");
      } else {
        console.error("更新失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div className="container my-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">編集</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SubscriptionForm handleSubmit={handleSubmit} value={subscription} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
