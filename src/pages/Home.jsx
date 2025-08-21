import React from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import heroImage from '@/assets/hero-music.jpg';
import album1 from '@/assets/album1.jpg';
import album2 from '@/assets/album2.jpg';
import album3 from '@/assets/album3.jpg';

const Home = () => {
  const { playTrack } = useMusic();

  // Mock data
  const featuredPlaylists = [
    { id: '1', name: 'Today\'s Top Hits', cover: album1, description: 'The biggest hits right now' },
    { id: '2', name: 'Chill Vibes', cover: album2, description: 'Relax and unwind with these tracks' },
    { id: '3', name: 'Workout Beats', cover: album3, description: 'High energy tracks for your workout' },
  ];

  const recentlyPlayed = [
    { id: '1', title: 'Neon Dreams', artist: 'Electric Pulse', album: 'Digital Horizons', duration: 210, cover: album1 },
    { id: '2', title: 'Sunset Boulevard', artist: 'Indie Collective', album: 'Golden Hour', duration: 195, cover: album2 },
    { id: '3', title: 'Bass Drop', artist: 'HyperBeat', album: 'Electronic Revolution', duration: 230, cover: album3 },
  ];

  const handlePlayTrack = (track) => {
    playTrack(track, recentlyPlayed);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div 
        className="relative h-80 rounded-2xl overflow-hidden bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Feel the Beat
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Discover millions of songs and podcasts
            </p>
            <Button 
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
        <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlaylists.map((playlist) => (
            <Card 
              key={playlist.id}
              className="group bg-gradient-glass backdrop-blur-glass border-glass-border hover:bg-glass/50 transition-all duration-300 cursor-pointer shadow-glass hover:shadow-elevated"
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
        <div className="space-y-2">
          {recentlyPlayed.map((track, index) => (
            <div
              key={track.id}
              className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="relative">
                <img
                  src={track.cover}
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
                <h4 className="font-medium text-foreground truncate">{track.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              
              <div className="hidden md:block text-sm text-muted-foreground">
                {track.album}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
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