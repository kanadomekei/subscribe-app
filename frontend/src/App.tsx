import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(AppRoutes);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
