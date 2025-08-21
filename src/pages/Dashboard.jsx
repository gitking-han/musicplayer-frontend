import React, { useState } from 'react';
import { Plus, Upload, Music, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [trackForm, setTrackForm] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    cover: '',
    url: ''
  });

  const handleInputChange = (field, value) => {
    setTrackForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!trackForm.title || !trackForm.artist) {
      toast({
        title: "Error",
        description: "Please fill in at least title and artist",
        variant: "destructive"
      });
      return;
    }

    // Convert duration to seconds (assuming MM:SS format)
    const [minutes, seconds] = trackForm.duration.split(':').map(Number);
    const durationInSeconds = (minutes * 60) + (seconds || 0);

    const newTrack = {
      id: Date.now().toString(),
      title: trackForm.title,
      artist: trackForm.artist,
      album: trackForm.album || 'Unknown Album',
      duration: durationInSeconds || 180,
      cover: trackForm.cover || '/placeholder.svg',
      url: trackForm.url
    };

    // Here you would typically save to your backend/database
    console.log('New track added:', newTrack);
    
    toast({
      title: "Success",
      description: "Track added successfully!",
    });

    // Reset form
    setTrackForm({
      title: '',
      artist: '',
      album: '',
      duration: '',
      cover: '',
      url: ''
    });
    setShowForm(false);
  };

  const resetForm = () => {
    setTrackForm({
      title: '',
      artist: '',
      album: '',
      duration: '',
      cover: '',
      url: ''
    });
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your music library</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 shadow-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Track
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tracks
            </CardTitle>
            <Music className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Artists
            </CardTitle>
            <Upload className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">456</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Albums
            </CardTitle>
            <Music className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Track Form */}
      {showForm && (
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              Add New Track
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Track Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter track title"
                    value={trackForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-glass/20 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist *</Label>
                  <Input
                    id="artist"
                    placeholder="Enter artist name"
                    value={trackForm.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    className="bg-glass/20 border-glass-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    placeholder="Enter album name"
                    value={trackForm.album}
                    onChange={(e) => handleInputChange('album', e.target.value)}
                    className="bg-glass/20 border-glass-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (MM:SS)</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 3:45"
                    value={trackForm.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="bg-glass/20 border-glass-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  placeholder="Enter cover image URL"
                  value={trackForm.cover}
                  onChange={(e) => handleInputChange('cover', e.target.value)}
                  className="bg-glass/20 border-glass-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Audio File URL</Label>
                <Input
                  id="url"
                  placeholder="Enter audio file URL"
                  value={trackForm.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="bg-glass/20 border-glass-border"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Track
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Tracks */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Recent Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-3 rounded-lg bg-glass/20 hover:bg-glass/30 transition-colors">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Sample Track {item}</h4>
                  <p className="text-sm text-muted-foreground">Sample Artist • Sample Album</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  3:45
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;