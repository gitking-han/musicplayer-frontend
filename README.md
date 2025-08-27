🎵 Music Player

A responsive, modern music player built with React, Vite, TailwindCSS, and shadcn/ui, featuring playlists, liked songs, repeat/shuffle modes, and backend API integration.

🚀 Features

🎶 Upload and stream songs from backend

❤️ Like songs and manage your Liked Songs playlist

🔁 Repeat modes: none, repeat-all, repeat-one

🔀 Shuffle playback

⏯️ Play, pause, seek, next/previous track

📱 Responsive UI for desktop & mobile

⚡ Powered by React + Vite for fast dev experience

🎨 Styled with TailwindCSS & shadcn/ui components

🛠️ Tech Stack

Frontend: React, Vite, TypeScript

UI: TailwindCSS, shadcn/ui, lucide-react icons

State Management: React Context API

Backend (API): Node.js + Express (songs endpoint)

📦 Getting Started
1. Clone the repository
git clone https://github.com/gitking-han/musicplayer-frontend.git
cd musicplayer-frontend

2. Install dependencies
npm install

3. Run development server
npm run dev


App will be running at:
👉 http://localhost:5173/

🔗 API Setup

Make sure your backend API (songs, liked songs, etc.) is running on
http://localhost:5000/

Example endpoint used:

GET http://localhost:5000/api/songs

📂 Project Structure
musicplayer-frontend/
│── src/
│   ├── components/      # UI components (Player, SongCard, etc.)
│   ├── contexts/        # MusicContext (state management)
│   ├── pages/           # Pages (Library, LikedSongs, Playlist, etc.)
│   ├── App.tsx
│   └── main.tsx
│── public/
│── package.json
│── tailwind.config.js
│── vite.config.ts

🌍 Deployment

Deploy easily using Vercel, Netlify, or Lovable.

For custom domains, configure DNS in your hosting provider.

📝 License

This project is open-source and available under the MIT License.

✨ Enjoy your music with Music Player!