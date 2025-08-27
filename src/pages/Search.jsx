import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Heart, MoreHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useMusic } from '../contexts/MusicContext';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { playSong } = useMusic();

  // Fetch all songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/songs'); // update your API endpoint
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
      }
    };
    fetchSongs();
  }, []);

  // Filter songs based on search query
  const filteredResults = searchQuery
    ? searchResults.filter((track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handlePlayTrack = (track) => {
    playSong(track, filteredResults); // play track and set filtered list as playlist
  };

  const browseCategories = [
    { id: '1', name: 'Pop', color: 'bg-gradient-to-br from-pink-400 to-purple-600' },
    { id: '2', name: 'Hip-Hop', color: 'bg-gradient-to-br from-orange-400 to-red-600' },
    { id: '3', name: 'Rock', color: 'bg-gradient-to-br from-gray-400 to-gray-800' },
    { id: '4', name: 'Electronic', color: 'bg-gradient-to-br from-cyan-400 to-blue-600' },
    { id: '5', name: 'Jazz', color: 'bg-gradient-to-br from-yellow-400 to-orange-600' },
    { id: '6', name: 'Classical', color: 'bg-gradient-to-br from-indigo-400 to-purple-600' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Search Header */}
      <div className="max-w-md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-glass/30 border-glass-border backdrop-blur-glass"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>
          <div className="space-y-2">
            {filteredResults.length > 0 ? (
              filteredResults.map((track) => (
                <div
                  key={track._id}
                  className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="relative">
                    <img
                      src={track.coverUrl || '/placeholder.svg'}
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
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </section>
      )}

      {/* Browse Categories */}
      {!searchQuery && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {browseCategories.map((category) => (
              <Card
                key={category.id}
                className={`${category.color} h-24 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 border-0 shadow-glass`}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;
