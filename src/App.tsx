import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import useColorMode from "./hooks/useColorMode";

const queryClient = new QueryClient();

const App: React.FC = () => {
  useColorMode();
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
