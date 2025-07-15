import userLibraryData from '@/services/mockData/userLibrary.json';

const userLibraryService = {
  async getLibrary() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...userLibraryData };
  },

  async addSongToLibrary(song) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!userLibraryData.savedSongs.find(s => s.Id === song.Id)) {
      userLibraryData.savedSongs.push(song);
    }
    return { ...userLibraryData };
  },

  async removeSongFromLibrary(songId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    userLibraryData.savedSongs = userLibraryData.savedSongs.filter(s => s.Id !== parseInt(songId));
    return { ...userLibraryData };
  },

  async addAlbumToLibrary(album) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!userLibraryData.savedAlbums.find(a => a.Id === album.Id)) {
      userLibraryData.savedAlbums.push(album);
    }
    return { ...userLibraryData };
  },

  async removeAlbumFromLibrary(albumId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    userLibraryData.savedAlbums = userLibraryData.savedAlbums.filter(a => a.Id !== parseInt(albumId));
    return { ...userLibraryData };
  },

  async addToRecentlyPlayed(song) {
    await new Promise(resolve => setTimeout(resolve, 200));
    userLibraryData.recentlyPlayed = userLibraryData.recentlyPlayed.filter(s => s.Id !== song.Id);
    userLibraryData.recentlyPlayed.unshift(song);
    if (userLibraryData.recentlyPlayed.length > 10) {
      userLibraryData.recentlyPlayed = userLibraryData.recentlyPlayed.slice(0, 10);
    }
    return { ...userLibraryData };
  },

  async getSavedSongs() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...userLibraryData.savedSongs];
  },

  async getSavedAlbums() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...userLibraryData.savedAlbums];
  },

  async getRecentlyPlayed() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...userLibraryData.recentlyPlayed];
  }
};

export default userLibraryService;