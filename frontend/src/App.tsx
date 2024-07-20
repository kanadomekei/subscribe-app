import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/authProvider";

const router = createBrowserRouter(AppRoutes);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
