export type Subscription = {
  id: number;
  appName: string;
  link: string;
  price: number;
  interval: "month" | "year";
  payment: Date;
  period: number;
  startMonth: Date;
};

export type User = {
  id: number;
  password: string;
};
