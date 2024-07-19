import Layout from "@/components/layout";
import AddForm from "@/pages/addForm";
import Home from "@/pages/home";
import Login from "@/pages/login";
import { RouteObject } from "react-router-dom";

export const AppRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/add", element: <AddForm /> },
    ],
  },
  { path: "/login", element: <Login /> },
];
