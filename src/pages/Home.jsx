import React from "react";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useMusic } from "../contexts/MusicContext";
import heroImage from "../assets/hero-music.jpg";

const Home = () => {
  const { songs, playSong } = useMusic();

  const handlePlayTrack = (track) => {
    playSong(track, songs); // Use songs from context
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div
        className="relative h-80 rounded-2xl overflow-hidden bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Feel the Beat</h1>
            <p className="text-xl mb-8 text-white/80">
              Discover millions of songs and podcasts
            </p>
            <Button
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`,
              }}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full shadow-primary"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Listening
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.slice(0, 3).map((song) => (
            <Card
              key={song._id}
              className="group bg-gradient-glass backdrop-blur-glass border-glass-border hover:bg-glass/50 transition-all duration-300 cursor-pointer shadow-glass hover:shadow-elevated"
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <img
                    src={song.cover || heroImage}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    onClick={() => handlePlayTrack(song)}
                    className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Played (All songs from backend for now) */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
        <div className="space-y-2">
          {songs.map((track) => (
            <div
              key={track._id}
              className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="relative">
                <img
                  src={track.cover || heroImage}
                  alt={track.album}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <Button
                  size="sm"
                  className="absolute inset-0 h-12 w-12 rounded-md bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Play className="h-4 w-4 ml-0.5 text-white" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {track.title}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artist}
                </p>
              </div>

              <div className="hidden md:block text-sm text-muted-foreground">
                {track.album}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, "0")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
