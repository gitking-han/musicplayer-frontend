import React, { useState, useMemo, useContext } from "react";
import {
  Plus,
  Grid3X3,
  List as ListIcon,
  Search as SearchIcon,
  Filter,
  Play,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useMusic } from "../contexts/MusicContext";
import { PlaylistContext } from "../contexts/PlaylistContext";
import { AlbumContext } from "../contexts/AlbumContext";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "components/ui/ConfirmDeleteModal";
/** Helper to normalize playlist tracks property */
const getPlaylistTracks = (playlist, allSongs) => {
  const raw = playlist?.songs ?? playlist?.tracks ?? [];
  // If backend stores song ids, map to song objects for playTrack
  const isIds = raw.length && (typeof raw[0] === "string" || typeof raw[0] === "number");
  if (isIds) {
    return raw
      .map((id) => allSongs.find((s) => s._id === id || s.id === id))
      .filter(Boolean);
  }
  // Else they might already be full song objects
  return raw;
};

const Library = () => {
  // contexts
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
  const { songs, playSong, playTrack } = useMusic();
  const { playlists, addPlaylist, updatePlaylist, deletePlaylist } = useContext(PlaylistContext);
  const { albums } = useContext(AlbumContext);
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ui state
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // modal state (create/edit playlist)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    coverUrl: "",
    songIds: [],
  });
  const [songSearch, setSongSearch] = useState("");

  const toggleExpand = (id) => {
    setExpandedPlaylistId((prev) => (prev === id ? null : id));
  };
  // filter datasets for current search
  const filteredPlaylists = useMemo(() => {
    return (playlists || []).filter((p) =>
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playlists, searchQuery]);

  const filteredAlbums = useMemo(() => {
    return (albums || []).filter((a) =>
      (a.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [albums, searchQuery]);

  const filteredSongs = useMemo(() => {
    return (songs || []).filter((s) =>
      (s.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [songs, searchQuery]);

  // --- Play handlers ---
  const handlePlayPlaylist = (playlist) => {
    const tracks = getPlaylistTracks(playlist, songs);
    if (tracks.length) {
      playSong(tracks[0], tracks);
    }
  };

  const handlePlayAlbum = (album) => {
    // Try albumId first, then fall back to matching by name if albumId missing
    const albumTracks = (songs || []).filter(
      (s) => s.albumId === album._id || s.album === album.name
    );
    if (albumTracks.length) {
      playTrack(albumTracks[0], albumTracks);
    }
  };

  // --- CRUD: Create / Edit Playlist Modal helpers ---
  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", coverUrl: "", songIds: [] });
    setSongSearch("");
    setIsModalOpen(true);
  };

  const openEdit = (playlist) => {
    const raw = playlist?.songs ?? playlist?.tracks ?? [];
    const isIds = raw.length && (typeof raw[0] === "string" || typeof raw[0] === "number");
    const songIds = isIds ? raw : raw.map((t) => t._id || t.id).filter(Boolean);

    setEditingId(playlist._id);
    setForm({
      name: playlist.name || "",
      description: playlist.description || "",
      coverUrl: playlist.coverUrl || "",
      songIds,
    });
    setSongSearch("");
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSongInForm = (id) => {
    setForm((prev) => {
      const has = prev.songIds.includes(id);
      return { ...prev, songIds: has ? prev.songIds.filter((x) => x !== id) : [...prev.songIds, id] };
    });
  };

  const handleDelete = (id) => {
    setDeleteId(id);       // store the playlist ID
    setIsConfirmOpen(true); // open modal
  };
  const confirmDelete = async () => {
    try {
      await deletePlaylist(deleteId);
      toast.success("Playlist deleted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete playlist.");
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Playlist name is required.");
      return;
    }

    // Backend payload (adjust field names if your API differs)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl?.trim(),
      songs: form.songIds, // array of song IDs
    };

    try {
      if (editingId) {
        await updatePlaylist(editingId, payload);
        toast.success("Playlist updated successfully!");
      } else {
        await addPlaylist(payload);
        toast.success("Playlist created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save playlist.");
    }
  };

  // songs available for selection in modal
  const modalSongList = useMemo(() => {
    const q = songSearch.trim().toLowerCase();
    const base = songs || [];
    if (!q) return base;
    return base.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.artist || "").toLowerCase().includes(q) ||
        (s.album || "").toLowerCase().includes(q)
    );
  }, [songs, songSearch]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <ListIcon className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="songs">Songs</TabsTrigger>
        </TabsList>

        {/* Playlists */}
        {/* Playlists */}
        <TabsContent value="playlists" className="mt-6">
          {viewMode === "grid" ? (
            filteredPlaylists.length === 0 ? (
              <p className="text-center text-muted-foreground mt-10">
                No saved Libraries yet. Start saving Libraries you love!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaylists.map((playlist) => {
                  const tracks = getPlaylistTracks(playlist, songs);
                  const coverSrc =
                    playlist.coverUrl ||
                    (tracks?.[0]?.coverUrl ??
                      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4");

                  return (
                    <Card
                      key={playlist._id}
                      className="group bg-glass/50 backdrop-blur-glass border-glass-border hover:bg-glass/50 transition-all duration-300 shadow-glass hover:shadow-elevated"
                    >
                      <div className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={coverSrc}
                            alt={playlist.name || "Untitled Playlist"}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          {/* Edit & Delete */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(playlist);
                              }}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(playlist._id);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Play */}
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPlaylist(playlist);
                            }}
                            className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <Play className="h-5 w-5 ml-0.5" />
                          </Button>
                        </div>

                        {/* Info + Expand */}
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {playlist.name || "Untitled Playlist"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {playlist.description || "No description provided."}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(tracks || []).length} tracks
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedPlaylistId((prev) =>
                                prev === playlist._id ? null : playlist._id
                              )
                            }
                          >
                            {expandedPlaylistId === playlist._id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                        </div>

                        {/* Collapsible Tracks */}
                        {expandedPlaylistId === playlist._id && (
                          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border-t border-glass-border pt-2">
                            {tracks.length ? (
                              tracks.map((song) => (
                                <div
                                  key={song._id}
                                  className="flex items-center justify-between p-2 rounded-md hover:bg-glass/40 transition"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {song.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {song.artist}
                                    </p>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => playSong(song, tracks)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground text-center">
                                No songs in this playlist.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )
          ) : filteredPlaylists.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10">
              No saved Libraries yet. Start saving Libraries you love!
            </p>
          ) : (
            <div className="space-y-2">
              {filteredPlaylists.map((playlist) => {
                const tracks = getPlaylistTracks(playlist, songs);
                const coverSrc =
                  playlist.coverUrl ||
                  (tracks?.[0]?.coverUrl ??
                    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4");

                return (
                  <div
                    key={playlist._id}
                    className="group p-3 rounded-lg bg-glass/30 hover:bg-glass/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={coverSrc}
                        alt={playlist.name || "Untitled Playlist"}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {playlist.name || "Untitled Playlist"}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {playlist.description || "No description provided."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(tracks || []).length} tracks
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-9 px-2"
                          onClick={() => openEdit(playlist)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-9 px-2"
                          onClick={() => handleDelete(playlist._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePlayPlaylist(playlist)}
                          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-primary"
                          title="Play"
                        >
                          <Play className="h-4 w-4 ml-0.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedPlaylistId((prev) =>
                              prev === playlist._id ? null : playlist._id
                            )
                          }
                        >
                          {expandedPlaylistId === playlist._id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Collapsible Tracks */}
                    {expandedPlaylistId === playlist._id && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border-t border-glass-border pt-2">
                        {tracks.length ? (
                          tracks.map((song) => (
                            <div
                              key={song._id}
                              className="flex items-center gap-3 justify-between p-2 rounded-md hover:bg-glass/40 transition"
                            >

                              <div className="min-w-0 flex items gap-3">
                                <img src={song.coverUrl} alt="no" className="h-10 w-10 rounded-lg object-cover" />
                                <div>
                                  <p className="text-sm font-medium truncate">
                                    {song.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {song.artist}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => playSong(song, tracks)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground text-center">
                            No songs in this playlist.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>




        {/* Albums */}
        <TabsContent value="albums" className="mt-6">
          {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlbums.map((album) => {
                const albumTracks = (songs || []).filter(
                  (s) => s.albumId === album._id || s.album === album.name
                );
                return (
                  <Card
                    key={album._id}
                    className="group bg-gradient-glass backdrop-blur-glass border-glass-border hover:bg-glass/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={album.cover || "/default-album.jpg"}
                          alt={album.name}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayAlbum(album);
                          }}
                          className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {album.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {album.artist}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {albumTracks.length} tracks
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No saved albums yet. Start saving albums you love!</p>
            </div>
          )}
        </TabsContent>

        {/* Songs */}
        <TabsContent value="songs" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSongs.map((song) => (
                <Card
                  key={song._id}
                  className="group bg-gradient-glass backdrop-blur-glass border-glass-border hover:bg-glass/50 transition-all duration-300 cursor-pointer shadow-glass hover:shadow-elevated"
                  onClick={() => playSong(song)}
                >
                  <div className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={song.coverUrl || "/default-song.jpg"}
                        alt={song.title}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(song);
                        }}
                        className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
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
          ) : (
            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <div
                  key={song._id}
                  className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-glass/30 transition-all duration-300 cursor-pointer"
                  onClick={() => playSong(song)}
                >
                  <img
                    src={song.coverUrl || "/default-song.jpg"}
                    alt={song.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {song.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist} {song.album ? `• ${song.album}` : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-primary"
                  >
                    <Play className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create / Edit Playlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
            aria-hidden="true"
          />
          {/* modal card */}
          <div className="relative z-10 w-full max-w-3xl rounded-xl bg-background border border-glass-border shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {editingId ? "Edit Playlist" : "Create Playlist"}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g., Road Trip Vibes"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cover URL</label>
                  <Input
                    value={form.coverUrl}
                    onChange={(e) => handleFormChange("coverUrl", e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Say something about this playlist…"
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    rows={3}
                  />
                </div>
              </div>

              {/* Song picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Select Songs ({form.songIds.length} selected)
                  </label>
                  <div className="relative w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={songSearch}
                      onChange={(e) => setSongSearch(e.target.value)}
                      placeholder="Search songs, artists, albums"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="max-h-56 overflow-auto rounded-lg border border-glass-border">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                      <tr>
                        <th className="text-left p-2 w-10"></th>
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Artist</th>
                        <th className="text-left p-2">Album</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalSongList.map((s) => {
                        const id = s._id || s.id;
                        const checked = form.songIds.includes(id);
                        return (
                          <tr
                            key={id}
                            className="hover:bg-accent/50 cursor-pointer"
                            onClick={() => toggleSongInForm(id)}
                          >
                            <td className="p-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleSongInForm(id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="p-2">{s.title}</td>
                            <td className="p-2">{s.artist}</td>
                            <td className="p-2">{s.album}</td>
                          </tr>
                        );
                      })}
                      {!modalSongList.length && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            No songs match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Save Changes" : "Create Playlist"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default Library;
