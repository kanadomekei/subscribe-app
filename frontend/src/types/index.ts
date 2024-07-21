export type Subscription = {
  id: number;
  appName: string;
  link: string;
  price: number;
  interval: "month" | "year";
  payment: number;
  period: number;
  startMonth: Date;
};

export type SubscriptionEx = {
  ID: number;
  AppName: string;
  Url: string;
  Price: number;
  Interval: "month" | "year";
  Payment: number;
  Period: number;
  StartDate: string;
};

export type User = {
  id: number;
  password: string;
};

export type FormValue = {
  link: string;
  current: boolean;
  appName: string;
  price: number | "";
  interval: "month" | "year";
  payment: string;
  startMonth: Date;
  period?: number | "" | undefined;
};
