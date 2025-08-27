import React, { useState, useContext } from "react";
import { Plus, X, Pencil, Trash2, Play, Pause } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { SongContext } from "../contexts/SongContext";
import { useMusic } from "../contexts/MusicContext";

const Dashboard = () => {
  const { toast } = useToast();
  const { currentSong, isPlaying, playSong, pauseSong } = useMusic();
  const { songs, loading, addSong, updateSong, deleteSong } = useContext(SongContext);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [trackForm, setTrackForm] = useState({
    title: "",
    artist: "",
    album: "",
    coverUrl: "",
    audioFiles: [], // ✅ multiple files
  });

  const resetForm = () => {
    setTrackForm({ title: "", artist: "", album: "", coverUrl: "", audioFiles: [] });
    setEditId(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setTrackForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setTrackForm((prev) => ({ ...prev, audioFiles: Array.from(e.target.files) })); // ✅ store all files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trackForm.title && trackForm.audioFiles.length === 0 && !editId) {
      toast({ title: "Error", description: "Please select at least one audio file.", variant: "destructive" });
      return;
    }

    try {
      if (editId) {
        // update single track
        await updateSong(editId, {
          title: trackForm.title,
          artist: trackForm.artist,
          album: trackForm.album || "Unknown Album",
          coverUrl: trackForm.coverUrl || "/placeholder.svg",
        });
        toast({ title: "Updated", description: "Track updated successfully!" });
      } else {
        // ✅ upload multiple songs
        for (const file of trackForm.audioFiles) {
          await addSong({
            title: trackForm.title || file.name,
            artist: trackForm.artist || "Unknown Artist",
            album: trackForm.album || "Unknown Album",
            coverUrl: trackForm.coverUrl || "/placeholder.svg",
            audioFile: file,
          });
        }
        toast({ title: "Success", description: "Songs uploaded successfully!" });
      }
      resetForm();
    } catch (err) {
      console.error("Error saving track:", err);
      toast({ title: "Error", description: "Failed to save track.", variant: "destructive" });
    }
  };

  const handleEdit = (song) => {
    setEditId(song._id);
    setTrackForm({
      title: song.title,
      artist: song.artist,
      album: song.album,
      coverUrl: song.coverUrl,
      audioFiles: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSong(id);
      toast({ title: "Deleted", description: "Track removed successfully!" });
    } catch {
      toast({ title: "Error", description: "Failed to delete track.", variant: "destructive" });
    }
  };

  const handlePlayPause = (song) => {
    if (currentSong?._id === song._id) {
      isPlaying ? pauseSong() : playSong(song);
    } else {
      playSong(song);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your music library</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-primary">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Close Form" : "Add Track(s)"}
        </Button>
      </div>
{/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader><CardTitle>Total Tracks</CardTitle></CardHeader>
          <CardContent>{songs.length || "—"}</CardContent>
        </Card>
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader><CardTitle>Total Albums</CardTitle></CardHeader>
          <CardContent>{songs.length ? new Set(songs.map((s) => s.album)).size : "—"}</CardContent>
        </Card>
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader><CardTitle>Total Artists</CardTitle></CardHeader>
          <CardContent>{songs.length ? new Set(songs.map((s) => s.artist)).size : "—"}</CardContent>
        </Card>
      </div>
      
      {/* Form */}
      {showForm && (
        <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{editId ? "Edit Track" : "Upload New Tracks"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Track Title (optional, will use filename if blank)" value={trackForm.title} onChange={(e) => handleInputChange("title", e.target.value)} />
              <Input placeholder="Artist" value={trackForm.artist} onChange={(e) => handleInputChange("artist", e.target.value)} />
              <Input placeholder="Album" value={trackForm.album} onChange={(e) => handleInputChange("album", e.target.value)} />
              <Input placeholder="Cover Image URL" value={trackForm.coverUrl} onChange={(e) => handleInputChange("coverUrl", e.target.value)} />
              {!editId && (
                <Input type="file" accept="audio/*" multiple onChange={handleFileChange} /> // ✅ multiple files
              )}
              <Button type="submit">{editId ? "Update" : "Upload"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Track List */}
      <Card className="bg-gradient-glass backdrop-blur-glass border-glass-border">
        <CardHeader><CardTitle>Recent Uploads</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : songs.length > 0 ? (
            songs.map((track) => (
              <div key={track._id} className="flex items-center justify-between p-3 border-b border-muted/20">
                <div className="flex items-center gap-3">
                  <img src={track.coverUrl || "/placeholder.svg"} alt={track.title} className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" onClick={() => handlePlayPause(track)}>
                    {currentSong?._id === track._id && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" onClick={() => handleEdit(track)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" onClick={() => handleDelete(track._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))
          ) : (
            <p>No tracks yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
