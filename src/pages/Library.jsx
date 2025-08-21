import React, { useState } from 'react';
import { Plus, Grid3X3, List, Search, Filter, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusic } from '@/contexts/MusicContext';
import album1 from '@/assets/album1.jpg';
import album2 from '@/assets/album2.jpg';
import album3 from '@/assets/album3.jpg';

const Library = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useMusic();

  // Mock user library data
  const playlists = [
    { id: '1', name: 'My Playlist #1', description: 'Created by you', cover: album1, tracks: 15 },
    { id: '2', name: 'Favorites', description: 'Your favorite songs', cover: album2, tracks: 32 },
    { id: '3', name: 'Road Trip', description: 'Perfect for long drives', cover: album3, tracks: 28 },
  ];

  const recentlyPlayed = [
    { id: '1', title: 'Neon Dreams', artist: 'Electric Pulse', album: 'Digital Horizons', duration: 210, cover: album1, playedAt: '2 hours ago' },
    { id: '2', title: 'Sunset Boulevard', artist: 'Indie Collective', album: 'Golden Hour', duration: 195, cover: album2, playedAt: '5 hours ago' },
    { id: '3', title: 'Bass Drop', artist: 'HyperBeat', album: 'Electronic Revolution', duration: 230, cover: album3, playedAt: '1 day ago' },
  ];

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in Your Library"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-glass/30 border-glass-border backdrop-blur-glass"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="bg-glass/30 border-glass-border">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
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
                    <p className="text-xs text-muted-foreground mt-1">{playlist.tracks} tracks</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{playlist.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                    <p className="text-xs text-muted-foreground">{playlist.tracks} tracks</p>
                  </div>
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-primary"
                  >
                    <Play className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-2">
            {recentlyPlayed.map((track) => (
              <div
                key={track.id}
                className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={track.cover}
                  alt={track.album}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{track.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="hidden md:block text-sm text-muted-foreground">
                  {track.playedAt}
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artists" className="mt-6">
          <div className="text-center text-muted-foreground py-8">
            <p>No followed artists yet. Start following your favorite artists!</p>
          </div>
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
          <div className="text-center text-muted-foreground py-8">
            <p>No saved albums yet. Start saving albums you love!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;