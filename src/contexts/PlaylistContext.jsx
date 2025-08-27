import React, { createContext, useState, useEffect } from "react";

export const PlaylistContext = createContext();

const API_URL = "http://localhost:5000/api/playlists";

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { "auth-token": token }),
    };
  };

  // ✅ Fetch only logged-in user's playlists
  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${API_URL}/my`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errMsg = `❌ Fetch failed: ${res.status} ${res.statusText}`;
        console.error(errMsg);
        setError(errMsg);
        setPlaylists([]);
        return;
      }

      const data = await res.json();
      console.log("✅ Playlists fetched:", data);

      // Ensure we only store an array in state
      if (Array.isArray(data)) {
        setPlaylists(data);
      } else if (Array.isArray(data.playlists)) {
        setPlaylists(data.playlists);
      } else {
        console.warn("⚠ Unexpected response format:", data);
        setPlaylists([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch playlists:", err);
      setError(err.message);
      setPlaylists([]);
    }
  };

  // ✅ Create playlist
  const addPlaylist = async (playlist) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...playlist,
          isPublic: playlist.isPublic ?? true, // default public
        }),
      });

      if (!res.ok) {
        const errMsg = `❌ Create failed: ${res.status} ${res.statusText}`;
        console.error(errMsg);
        setError(errMsg);
        return;
      }

      const data = await res.json();
      console.log("✅ Playlist created:", data);
      setPlaylists((prev) => [...prev, data]);
    } catch (err) {
      console.error("❌ Create playlist error:", err);
      setError(err.message);
    }
  };

  // ✅ Update playlist
  const updatePlaylist = async (id, updatedPlaylist) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedPlaylist),
      });

      if (!res.ok) {
        const errMsg = `❌ Update failed: ${res.status} ${res.statusText}`;
        console.error(errMsg);
        setError(errMsg);
        return;
      }

      const data = await res.json();
      console.log("✅ Playlist updated:", data);
      setPlaylists((prev) => prev.map((p) => (p._id === id ? data : p)));
    } catch (err) {
      console.error("❌ Update playlist error:", err);
      setError(err.message);
    }
  };

  // ✅ Delete playlist
  const deletePlaylist = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errMsg = `❌ Delete failed: ${res.status} ${res.statusText}`;
        console.error(errMsg);
        setError(errMsg);
        return;
      }

      console.log("✅ Playlist deleted:", id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Delete playlist error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        fetchPlaylists, // expose refresh
        error, // expose error for UI
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
