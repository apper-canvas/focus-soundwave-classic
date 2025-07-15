import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import Home from '@/components/pages/Home';
import Search from '@/components/pages/Search';
import Library from '@/components/pages/Library';
import Profile from '@/components/pages/Profile';
import MusicPlayer from '@/components/organisms/MusicPlayer';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import userLibraryService from '@/services/api/userLibraryService';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load user favorites on app start
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const library = await userLibraryService.getLibrary();
        const favorites = library.savedSongs.map(song => song.Id);
        setFavoriteIds(favorites);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const handlePlay = async (song) => {
    try {
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Add to recently played
      await userLibraryService.addToRecentlyPlayed(song);
    } catch (error) {
      toast.error('Failed to play song');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    // Simple next implementation - in real app would use queue
    setIsPlaying(false);
    toast.info('Next song functionality would be implemented here');
  };

  const handlePrevious = () => {
    // Simple previous implementation - in real app would use queue
    setIsPlaying(false);
    toast.info('Previous song functionality would be implemented here');
  };

  const handleAddToPlaylist = (song) => {
    // Would show playlist selection modal in real app
    toast.success(`"${song.title}" added to playlist`);
  };

  const handleToggleFavorite = async (song) => {
    try {
      const isFavorite = favoriteIds.includes(song.Id);
      
      if (isFavorite) {
        await userLibraryService.removeSongFromLibrary(song.Id);
        setFavoriteIds(prev => prev.filter(id => id !== song.Id));
        toast.success('Removed from favorites');
      } else {
        await userLibraryService.addSongToLibrary(song);
        setFavoriteIds(prev => [...prev, song.Id]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToPlaylist={handleAddToPlaylist}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <Search 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToPlaylist={handleAddToPlaylist}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              } 
            />
            <Route 
              path="/library" 
              element={
                <Library 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToPlaylist={handleAddToPlaylist}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={<Profile />} 
            />
          </Routes>
        </AnimatePresence>

        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          queue={queue}
        />

        <BottomNavigation />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;