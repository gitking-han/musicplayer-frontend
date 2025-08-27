import React from "react";
import { Heart, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useMusic } from "../contexts/MusicContext";

const LikedSongs = () => {
  const { likedSongs, playPlaylist } = useMusic();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liked Songs</h1>
        {likedSongs.length > 0 && (
          <Button
            onClick={() => playPlaylist(likedSongs)}
            className="flex items-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>Play All</span>
          </Button>
        )}
      </div>

      {/* Songs */}
      {likedSongs.length === 0 ? (
        <p className="text-muted-foreground">No liked songs yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedSongs.map((song, idx) => (
            <Card
              key={song._id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => playPlaylist(likedSongs, idx)}
            >
              <CardContent className="flex items-center p-4 space-x-4">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{song.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {song.artist}
                  </p>
                </div>
                <Heart className="h-5 w-5 text-pink-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
