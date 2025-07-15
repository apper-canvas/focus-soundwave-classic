import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import Home from '@/components/pages/Home';
import Search from '@/components/pages/Search';
import Library from '@/components/pages/Library';
import Profile from '@/components/pages/Profile';
import DownloadManager from '@/components/pages/DownloadManager';
import MusicPlayer from '@/components/organisms/MusicPlayer';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import userLibraryService from '@/services/api/userLibraryService';
import downloadService from '@/services/api/downloadService';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [downloadedIds, setDownloadedIds] = useState([]);

// Load user favorites and downloads on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [library, downloads] = await Promise.all([
          userLibraryService.getLibrary(),
          downloadService.getAll()
        ]);
        const favorites = library.savedSongs.map(song => song.Id);
        const downloadedSongs = downloads.map(download => download.Id);
        setFavoriteIds(favorites);
        setDownloadedIds(downloadedSongs);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
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
    if (queue.length === 0) {
      setIsPlaying(false);
      toast.info('No songs in queue');
      return;
    }

    const currentIndex = queue.findIndex(song => song.Id === currentSong?.Id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      handlePlay(nextSong);
    } else {
      setIsPlaying(false);
      toast.info('End of queue reached');
    }
  };

  const handlePrevious = () => {
    if (queue.length === 0) {
      setIsPlaying(false);
      toast.info('No songs in queue');
      return;
    }

    const currentIndex = queue.findIndex(song => song.Id === currentSong?.Id);
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      handlePlay(prevSong);
    } else {
      toast.info('Already at beginning of queue');
    }
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

  const handleDownloadSong = async (song) => {
    try {
      await downloadService.downloadSong(song);
      setDownloadedIds(prev => [...prev, song.Id]);
      toast.success(`"${song.title}" downloaded for offline listening`);
    } catch (error) {
      toast.error('Failed to download song');
    }
  };

  const handleDownloadAlbum = async (album) => {
    try {
      await downloadService.downloadAlbum(album);
      const albumSongIds = album.songs?.map(song => song.Id) || [];
      setDownloadedIds(prev => [...prev, ...albumSongIds]);
      toast.success(`"${album.name}" downloaded for offline listening`);
    } catch (error) {
      toast.error('Failed to download album');
    }
  };

  const handleRemoveDownload = async (itemId) => {
    try {
      await downloadService.removeDownload(itemId);
      setDownloadedIds(prev => prev.filter(id => id !== itemId));
      toast.success('Download removed');
    } catch (error) {
      toast.error('Failed to remove download');
    }
};

  const handleAddToQueue = (song) => {
    const isAlreadyInQueue = queue.some(queueSong => queueSong.Id === song.Id);
    if (isAlreadyInQueue) {
      toast.info(`"${song.title}" is already in queue`);
      return;
    }
    
    setQueue(prev => [...prev, song]);
    toast.success(`"${song.title}" added to queue`);
  };

  const handleRemoveFromQueue = (songId) => {
    const songToRemove = queue.find(song => song.Id === songId);
    setQueue(prev => prev.filter(song => song.Id !== songId));
    
    if (songToRemove) {
      toast.success(`"${songToRemove.title}" removed from queue`);
    }
  };

  const handleReorderQueue = (newQueue) => {
    setQueue(newQueue);
    toast.success('Queue reordered');
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
                  onAddToQueue={handleAddToQueue}
                  onToggleFavorite={handleToggleFavorite}
                  onDownloadSong={handleDownloadSong}
                  onDownloadAlbum={handleDownloadAlbum}
                  favoriteIds={favoriteIds}
                  downloadedIds={downloadedIds}
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
                  onAddToQueue={handleAddToQueue}
                  onToggleFavorite={handleToggleFavorite}
                  onDownloadSong={handleDownloadSong}
                  onDownloadAlbum={handleDownloadAlbum}
                  favoriteIds={favoriteIds}
                  downloadedIds={downloadedIds}
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
                  onAddToQueue={handleAddToQueue}
                  onToggleFavorite={handleToggleFavorite}
                  onDownloadSong={handleDownloadSong}
                  onDownloadAlbum={handleDownloadAlbum}
                  favoriteIds={favoriteIds}
                  downloadedIds={downloadedIds}
                />
              } 
            />
<Route 
              path="/downloads" 
              element={
                <DownloadManager 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onRemoveDownload={handleRemoveDownload}
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
          onAddToQueue={handleAddToQueue}
          onRemoveFromQueue={handleRemoveFromQueue}
          onReorderQueue={handleReorderQueue}
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