import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MusicProvider, useMusic } from "@/contexts/MusicContext";
import MainLayout from "@/components/Layout/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useMusic();
  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useMusic();
  return !state.isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />
    <Route path="/signup" element={
      <PublicRoute>
        <Signup />
      </PublicRoute>
    } />
    <Route path="/" element={
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Home />} />
      <Route path="search" element={<Search />} />
      <Route path="library" element={<Library />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MusicProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </MusicProvider>
  </QueryClientProvider>
);

export default App;
