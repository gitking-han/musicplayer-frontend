import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Library, User, Plus, Heart, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Your Library', href: '/library', icon: Library },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <div className="h-full w-64 bg-gradient-glass backdrop-blur-glass border-r border-glass-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          MusicStream
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-primary/10 text-primary shadow-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-glass/50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Library Section */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Your Library
          </h3>
          <button className="p-1 rounded-md hover:bg-glass/50 transition-colors">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Liked Songs */}
          <NavLink
            to="/likedsongs"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-glass/50 transition-all duration-300"
          >
            <div className="mr-3 h-8 w-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            Liked Songs
          </NavLink>

          {/* User Playlists */}
          {user?.playlists?.map((playlist) => (
            <NavLink
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-glass/50 transition-all duration-300"
            >
              <img
                src={playlist.cover || '/placeholder.svg'}
                alt={playlist.name}
                className="mr-3 h-8 w-8 rounded-md object-cover"
              />
              <span className="truncate">{playlist.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto p-4">
        <NavLink
          to="/profile"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-glass/50 transition-all duration-300"
        >
          <User className="mr-3 h-5 w-5" />
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
