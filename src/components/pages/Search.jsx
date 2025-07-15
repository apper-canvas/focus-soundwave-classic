import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/molecules/SearchBar";
import TrackList from "@/components/organisms/TrackList";
import AlbumGrid from "@/components/organisms/AlbumGrid";
import GenreGrid from "@/components/organisms/GenreGrid";
import Button from "@/components/atoms/Button";
import songsService from "@/services/api/songsService";
import albumsService from "@/services/api/albumsService";
import genresService from "@/services/api/genresService";

const Search = ({ 
  currentSong, 
  isPlaying, 
  onPlay, 
  onPause, 
  onAddToPlaylist, 
  onToggleFavorite, 
  favoriteIds = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: []
  });
  const [genres, setGenres] = useState([]);
  const [activeTab, setActiveTab] = useState("songs");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genresLoading, setGenresLoading] = useState(true);

  const loadGenres = async () => {
    try {
      setGenresLoading(true);
      const genreData = await genresService.getAll();
      setGenres(genreData);
    } catch (err) {
      toast.error("Failed to load genres");
    } finally {
      setGenresLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], albums: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);

      const [songs, albums] = await Promise.all([
        songsService.search(query),
        albumsService.search(query)
      ]);

      setSearchResults({ songs, albums });
    } catch (err) {
      setError(err.message);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = async (genre) => {
    try {
      setLoading(true);
      setError(null);
      setSearchQuery(genre.name);
      setActiveTab("songs");

      const songs = await songsService.getByGenre(genre.name);
      setSearchResults({ songs, albums: [] });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load genre songs");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAlbum = (album) => {
    if (album.songs && album.songs.length > 0) {
      onPlay(album.songs[0]);
      toast.success(`Playing "${album.name}"`);
    }
  };

  const tabs = [
    { id: "songs", label: "Songs", count: searchResults.songs.length },
    { id: "albums", label: "Albums", count: searchResults.albums.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Search"
        subtitle="Find your favorite music"
      />
      
      <div className="px-4 py-6 pb-32 space-y-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search songs, artists, albums..."
        />

        {!searchQuery ? (
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-6">
              Browse by Genre
            </h2>
            <GenreGrid
              genres={genres}
              loading={genresLoading}
              onGenreClick={handleGenreClick}
              emptyMessage="No genres available"
            />
          </section>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                Search results for "{searchQuery}"
              </h2>
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "gradient" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label} ({tab.count})
                  </Button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "songs" && (
                <TrackList
                  tracks={searchResults.songs}
                  loading={loading}
                  error={error}
                  onRetry={() => handleSearch(searchQuery)}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlay={onPlay}
                  onPause={onPause}
                  onAddToPlaylist={onAddToPlaylist}
                  onToggleFavorite={onToggleFavorite}
                  favoriteIds={favoriteIds}
                  emptyMessage="No songs found"
                />
              )}

              {activeTab === "albums" && (
                <AlbumGrid
                  albums={searchResults.albums}
                  loading={loading}
                  error={error}
                  onRetry={() => handleSearch(searchQuery)}
                  onPlay={handlePlayAlbum}
                  onToggleFavorite={onToggleFavorite}
                  favoriteIds={favoriteIds}
                  emptyMessage="No albums found"
                />
              )}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Search;