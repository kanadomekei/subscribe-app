import Layout from "@/components/layout";
import AddForm from "@/pages/addForm";
import EditForm from "@/pages/editForm";
import Home from "@/pages/home";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import { RouteObject } from "react-router-dom";

export const AppRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/add", element: <AddForm /> },
      { path: "/:id/edit", element: <EditForm /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
];
