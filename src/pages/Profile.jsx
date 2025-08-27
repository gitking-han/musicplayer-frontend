import React, { useState } from "react";
import { Settings, LogOut, User, Music, Clock, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useMusic } from "../contexts/MusicContext";
import { useAuth } from "contexts/AuthContext";

// ✅ Import Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const {
    highQuality,
    autoplay,
    showUnplayable,
    toggleHighQuality,
    toggleAutoplay,
    toggleShowUnplayable,
  } = useMusic();

  const { logout, user, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const userStats = {
    totalPlaylists: user?.playlists?.length || 0,
    totalTracks: user?.tracks?.length || 0,
    totalListeningTime: "45h 23m",
    favoriteGenre: "Electronic",
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully 👋");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully 🎉");
      setIsEditOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.message || "Failed to update profile ❌");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass">
        <div className="p-8 flex items-center space-x-6">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {user?.username || "Music Lover"}
            </h1>
            <p className="text-muted-foreground mb-4">
              {user?.email || "user@example.com"}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{userStats.totalPlaylists} playlists</span>
              <span>•</span>
              <span>{userStats.totalTracks} tracks</span>
              <span>•</span>
              <span>Following 23 artists</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-glass-border bg-glass/30"
            onClick={() => setIsEditOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass text-center p-6">
          <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">
            {userStats.totalPlaylists}
          </h3>
          <p className="text-sm text-muted-foreground">Playlists Created</p>
        </Card>
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass text-center p-6">
          <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">
            {userStats.totalTracks}
          </h3>
          <p className="text-sm text-muted-foreground">Liked Songs</p>
        </Card>
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass text-center p-6">
          <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">
            {userStats.totalListeningTime}
          </h3>
          <p className="text-sm text-muted-foreground">Total Listening</p>
        </Card>
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass text-center p-6">
          <User className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            {userStats.favoriteGenre}
          </h3>
          <p className="text-sm text-muted-foreground">Favorite Genre</p>
        </Card>
      </div>

      {/* Settings */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">High Quality Audio</h3>
              <p className="text-sm text-muted-foreground">
                Stream music at 320kbps
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-glass-border bg-glass/30"
              onClick={toggleHighQuality}
            >
              {highQuality ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <Separator className="bg-glass-border" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Autoplay</h3>
              <p className="text-sm text-muted-foreground">
                Continue playing similar music when your playlist ends
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-glass-border bg-glass/30"
              onClick={toggleAutoplay}
            >
              {autoplay ? "On" : "Off"}
            </Button>
          </div>
          <Separator className="bg-glass-border" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Show Unplayable Songs</h3>
              <p className="text-sm text-muted-foreground">
                Show songs that can't be played
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-glass-border bg-glass/30"
              onClick={toggleShowUnplayable}
            >
              {showUnplayable ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border shadow-glass p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Account</h2>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          aria-describedby="edit-profile-description"
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription id="edit-profile-description">
              Update your username, email, or avatar URL below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Profile;
