import React from 'react';
import { Settings, LogOut, User, Music, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useMusic } from '@/contexts/MusicContext';

const Profile: React.FC = () => {
  const { state, logout } = useMusic();

  // Mock user stats
  const userStats = {
    totalPlaylists: 12,
    totalTracks: 247,
    totalListeningTime: '45h 23m',
    favoriteGenre: 'Electronic',
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-2 border-primary/20">
              <AvatarImage src={state.user?.avatar} alt={state.user?.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {state.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {state.user?.name || 'Music Lover'}
              </h1>
              <p className="text-muted-foreground mb-4">
                {state.user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{userStats.totalPlaylists} playlists</span>
                <span>•</span>
                <span>{userStats.totalTracks} tracks</span>
                <span>•</span>
                <span>Following 23 artists</span>
              </div>
            </div>
            <Button variant="outline" className="border-glass-border bg-glass/30">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
          <div className="p-6 text-center">
            <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{userStats.totalPlaylists}</h3>
            <p className="text-sm text-muted-foreground">Playlists Created</p>
          </div>
        </Card>

        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
          <div className="p-6 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{userStats.totalTracks}</h3>
            <p className="text-sm text-muted-foreground">Liked Songs</p>
          </div>
        </Card>

        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
          <div className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{userStats.totalListeningTime}</h3>
            <p className="text-sm text-muted-foreground">Total Listening</p>
          </div>
        </Card>

        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
          <div className="p-6 text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{userStats.favoriteGenre}</h3>
            <p className="text-sm text-muted-foreground">Favorite Genre</p>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">High Quality Audio</h3>
                <p className="text-sm text-muted-foreground">Stream music at 320kbps</p>
              </div>
              <Button variant="outline" size="sm" className="border-glass-border bg-glass/30">
                Enable
              </Button>
            </div>
            
            <Separator className="bg-glass-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Autoplay</h3>
                <p className="text-sm text-muted-foreground">Continue playing similar music when your playlist ends</p>
              </div>
              <Button variant="outline" size="sm" className="border-glass-border bg-glass/30">
                On
              </Button>
            </div>
            
            <Separator className="bg-glass-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Show Unplayable Songs</h3>
                <p className="text-sm text-muted-foreground">Show songs that can't be played</p>
              </div>
              <Button variant="outline" size="sm" className="border-glass-border bg-glass/30">
                Off
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Account</h2>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start border-glass-border bg-glass/30">
              <Settings className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start border-glass-border bg-glass/30">
              <User className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
            
            <Separator className="bg-glass-border" />
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;