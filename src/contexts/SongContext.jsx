import React, { createContext, useState, useEffect } from "react";

export const SongContext = createContext({
  songs: [],
  loading: false,
  fetchSongs: () => {},
  addSong: () => {},
  updateSong: () => {},
  deleteSong: () => {},
});

const API_URL = "http://localhost:5000/api/songs";

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Ensure each song has an _id or fallback key
      const normalized = (Array.isArray(data) ? data : [data]).map((song, idx) => ({
        ...song,
        _id: song._id || `temp-${Date.now()}-${idx}`,
      }));

      setSongs(normalized);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new songs (supports multiple uploads)
  const addSong = async (songData) => {
    try {
      const formData = new FormData();
      formData.append("songs", songData.audioFile); // required
      if (songData.coverFile) formData.append("cover", songData.coverFile); // optional
      formData.append("artist", songData.artist || "Unknown Artist");
      formData.append("album", songData.album || "Unknown Album");

      const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Normalize response (single or multiple)
      const newSongs = (Array.isArray(data) ? data : [data]).map((song, idx) => ({
        ...song,
        _id: song._id || `temp-${Date.now()}-${idx}`,
      }));

      setSongs((prev) => [...prev, ...newSongs]);
    } catch (err) {
      console.error("Failed to add song:", err);
    }
  };

  // Update a song
  const updateSong = async (id, updatedSong) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSong),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setSongs((prev) =>
        prev.map((s) =>
          s._id === id ? { ...data, _id: data._id || id } : s
        )
      );
    } catch (err) {
      console.error("Failed to update song:", err);
    }
  };

  // Delete a song
  const deleteSong = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

      setSongs((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete song:", err);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <SongContext.Provider
      value={{ songs, loading, fetchSongs, addSong, updateSong, deleteSong }}
    >
      {children}
    </SongContext.Provider>
  );
};
