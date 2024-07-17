import CreateForm from "@/pages/createForm";
import Home from "@/pages/home";
import Login from "@/pages/login";
import { RouteObject } from "react-router-dom";

export const AppRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/create", element: <CreateForm /> },
  { path: "/login", element: <Login /> },
];
