import React, { createContext, useState, useEffect } from "react";

export const AlbumContext = createContext();

const API_URL = "http://localhost:5000/api/albums";

export const AlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);

  const fetchAlbums = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setAlbums(data);
  };

  const addAlbum = async (album) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(album),
    });
    const data = await res.json();
    setAlbums([...albums, data]);
  };

  const updateAlbum = async (id, updatedAlbum) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAlbum),
    });
    const data = await res.json();
    setAlbums(albums.map((a) => (a._id === id ? data : a)));
  };

  const deleteAlbum = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setAlbums(albums.filter((a) => a._id !== id));
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <AlbumContext.Provider value={{ albums, addAlbum, updateAlbum, deleteAlbum }}>
      {children}
    </AlbumContext.Provider>
  );
};
