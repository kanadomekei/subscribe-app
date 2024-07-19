import { Subscription } from "@/types";

export const Subscriptions: Subscription[] = [
  {
    id: 1,
    appName: "Spotify",
    link: "https://open.spotify.com/intl-ja",
    price: 480,
    interval: "month",
    payment: 15,
    period: -1,
    startMonth: new Date(),
  },
  {
    id: 2,
    appName: "Netflix",
    link: "https://www.netflix.com/",
    price: 790,
    interval: "year",
    payment: 2,
    period: 2,
    startMonth: new Date("December 17, 2023"),
  },
  {
    id: 3,
    appName: "Amazon Prime Video",
    link: "https://www.amazon.co.jp/gp/video/storefront",
    price: 790,
    interval: "year",
    payment: 5,
    period: 3,
    startMonth: new Date("December 17, 2016 03:24:00"),
  },
  {
    id: 4,
    appName: "KindleUnlimited",
    link: "https://www.amazon.co.jp/b?ie=UTF8&node=3197885051",
    price: 790,
    interval: "year",
    payment: 2,
    period: 10,
    startMonth: new Date(),
  },
];
