import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MusicProvider } from "./contexts/MusicContext";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import LikedSongs from "pages/LikedSongs";
import { AlbumProvider } from "./contexts/AlbumContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { SongProvider } from "contexts/SongContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();

// ✅ Protect routes based on AuthContext
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth() || {}; // prevent undefined
  if (user === undefined) return null; // wait for auth context to load
  return user ? children : <Navigate to="/login" replace />;
};

// ✅ Public route for guests
const PublicRoute = ({ children }) => {
  const { user } = useAuth() || {}; // prevent undefined
  if (user === undefined) return null; // wait for auth context to load
  return !user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      }
    />

    {/* Protected Routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Home />} />
      <Route path="search" element={<Search />} />
      <Route path="library" element={<Library />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="likedsongs" element={<LikedSongs />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MusicProvider>
        <AlbumProvider>
          <PlaylistProvider>
            <SongProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  {/* Main App Content */}
                  <div className="flex-1">
                    <AppRoutes />
                    <ToastContainer position="top-right" autoClose={3000} />
                  </div>
                </div>
              </BrowserRouter>
              
            </TooltipProvider>
            </SongProvider>
          </PlaylistProvider>
        </AlbumProvider>
      </MusicProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
