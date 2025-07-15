import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TrackList from "@/components/organisms/TrackList";
import AlbumGrid from "@/components/organisms/AlbumGrid";
import PlaylistGrid from "@/components/organisms/PlaylistGrid";
import Button from "@/components/atoms/Button";
import userLibraryService from "@/services/api/userLibraryService";
import playlistsService from "@/services/api/playlistsService";

const Library = ({ 
  currentSong, 
  isPlaying, 
  onPlay, 
  onPause, 
  onAddToPlaylist, 
  onToggleFavorite, 
  onDownloadSong,
  onDownloadAlbum,
  favoriteIds = [],
  downloadedIds = []
}) => {
  const [activeTab, setActiveTab] = useState("songs");
  const [library, setLibrary] = useState({
    savedSongs: [],
    savedAlbums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [libraryData, playlists] = await Promise.all([
        userLibraryService.getLibrary(),
        playlistsService.getAll()
      ]);

      setLibrary({
        savedSongs: libraryData.savedSongs || [],
        savedAlbums: libraryData.savedAlbums || [],
        playlists: playlists || []
      });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      const newPlaylist = {
        name: "My Playlist",
        description: "A new playlist",
        songs: [],
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        isPublic: true
      };

      await playlistsService.create(newPlaylist);
      toast.success("Playlist created successfully");
      loadLibrary();
    } catch (err) {
      toast.error("Failed to create playlist");
    }
  };

  const handleDeletePlaylist = async (playlist) => {
    try {
      await playlistsService.delete(playlist.Id);
      toast.success("Playlist deleted successfully");
      loadLibrary();
    } catch (err) {
      toast.error("Failed to delete playlist");
    }
  };

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

  const tabs = [
    { id: "songs", label: "Songs", count: library.savedSongs.length },
    { id: "albums", label: "Albums", count: library.savedAlbums.length },
    { id: "playlists", label: "Playlists", count: library.playlists.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Your Library"
        subtitle="All your saved music in one place"
        actions={activeTab === "playlists" ? [
          { 
            icon: "Plus", 
            onClick: handleCreatePlaylist,
            variant: "gradient"
          }
        ] : []}
      />
      
      <div className="px-4 py-6 pb-32 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "gradient" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "songs" && (
<TrackList
              tracks={library.savedSongs}
              loading={loading}
              error={error}
              onRetry={loadLibrary}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
              onAddToPlaylist={onAddToPlaylist}
              onToggleFavorite={onToggleFavorite}
              onDownloadSong={onDownloadSong}
              favoriteIds={favoriteIds}
              downloadedIds={downloadedIds}
              emptyMessage="No saved songs"
              emptyIcon="Heart"
            />
          )}

          {activeTab === "albums" && (
<AlbumGrid
              albums={library.savedAlbums}
              loading={loading}
              error={error}
              onRetry={loadLibrary}
              onPlay={handlePlayAlbum}
              onToggleFavorite={onToggleFavorite}
              onDownloadAlbum={onDownloadAlbum}
              favoriteIds={favoriteIds}
              downloadedIds={downloadedIds}
              emptyMessage="No saved albums"
              emptyIcon="Disc"
            />
          )}

          {activeTab === "playlists" && (
            <PlaylistGrid
              playlists={library.playlists}
              loading={loading}
              error={error}
              onRetry={loadLibrary}
              onPlay={handlePlayPlaylist}
              onDelete={handleDeletePlaylist}
              emptyMessage="No playlists yet"
              emptyIcon="ListMusic"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Library;