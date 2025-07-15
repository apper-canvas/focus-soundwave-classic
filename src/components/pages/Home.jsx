import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import PlaylistGrid from "@/components/organisms/PlaylistGrid";
import AlbumGrid from "@/components/organisms/AlbumGrid";
import TrackList from "@/components/organisms/TrackList";
import songsService from "@/services/api/songsService";
import playlistsService from "@/services/api/playlistsService";
import albumsService from "@/services/api/albumsService";

const Home = ({ 
  currentSong, 
  isPlaying, 
  onPlay, 
  onPause, 
  onAddToPlaylist, 
  onToggleFavorite, 
  favoriteIds = [] 
}) => {
  const navigate = useNavigate();
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [playlists, songs, albums] = await Promise.all([
        playlistsService.getAll(),
        songsService.getAll(),
        albumsService.getAll()
      ]);

      setFeaturedPlaylists(playlists.slice(0, 6));
      setRecentlyPlayed(songs.slice(0, 5));
      setRecommendedAlbums(albums.slice(0, 6));
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load home content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      onPlay(playlist.songs[0]);
      toast.success(`Playing "${playlist.name}"`);
    }
  };

  const handlePlayAlbum = (album) => {
    if (album.songs && album.songs.length > 0) {
      onPlay(album.songs[0]);
      toast.success(`Playing "${album.name}"`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Good evening"
        subtitle="Welcome back to SoundWave"
      />
      
      <div className="px-4 py-6 pb-32 space-y-8">
        {/* Featured Playlists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">
              Featured Playlists
            </h2>
            <button
              onClick={() => navigate("/library")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all
            </button>
          </div>
          <PlaylistGrid
            playlists={featuredPlaylists}
            loading={loading}
            error={error}
            onRetry={loadHomeData}
            onPlay={handlePlayPlaylist}
            emptyMessage="No featured playlists"
          />
        </section>

        {/* Recently Played */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">
              Recently Played
            </h2>
            <button
              onClick={() => navigate("/library")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all
            </button>
          </div>
          <TrackList
            tracks={recentlyPlayed}
            loading={loading}
            error={error}
            onRetry={loadHomeData}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onPause={onPause}
            onAddToPlaylist={onAddToPlaylist}
            onToggleFavorite={onToggleFavorite}
            favoriteIds={favoriteIds}
            emptyMessage="No recently played tracks"
          />
        </section>

        {/* Recommended Albums */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">
              Recommended Albums
            </h2>
            <button
              onClick={() => navigate("/search")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Explore more
            </button>
          </div>
          <AlbumGrid
            albums={recommendedAlbums}
            loading={loading}
            error={error}
            onRetry={loadHomeData}
            onPlay={handlePlayAlbum}
            onToggleFavorite={onToggleFavorite}
            favoriteIds={favoriteIds}
            emptyMessage="No recommended albums"
          />
        </section>
      </div>
    </div>
  );
};

export default Home;