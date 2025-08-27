import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MusicPlayer from "./MusicPlayer";
import { useMusic } from "../../contexts/MusicContext";

const MainLayout = () => {
  const { currentSong } = useMusic();

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Music Player */}
        {currentSong && <MusicPlayer />}
      </div>
    </div>
  );
};

export default MainLayout;
