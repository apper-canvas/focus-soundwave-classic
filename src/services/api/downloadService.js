let downloadedContent = [];
let storageUsed = 0;
const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB limit

const downloadService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...downloadedContent];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const download = downloadedContent.find(d => d.Id === parseInt(id));
    if (!download) {
      throw new Error('Download not found');
    }
    return { ...download };
  },

  async downloadSong(song) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if already downloaded
    const existingDownload = downloadedContent.find(d => d.Id === song.Id && d.type === 'song');
    if (existingDownload) {
      throw new Error('Song already downloaded');
    }

    // Simulate file size (average 4MB per song)
    const fileSize = Math.floor(Math.random() * 2000000) + 3000000;
    
    // Check storage limit
    if (storageUsed + fileSize > STORAGE_LIMIT) {
      throw new Error('Storage limit exceeded');
    }

    const download = {
      Id: song.Id,
      type: 'song',
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      coverUrl: song.coverUrl,
      genre: song.genre,
      fileSize: fileSize,
      downloadedAt: new Date().toISOString(),
      lastPlayed: null,
      playCount: 0
    };

    downloadedContent.push(download);
    storageUsed += fileSize;
    return { ...download };
  },

  async downloadAlbum(album) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!album.songs || album.songs.length === 0) {
      throw new Error('Album has no songs to download');
    }

    const downloads = [];
    let totalSize = 0;

    for (const song of album.songs) {
      // Check if already downloaded
      const existingDownload = downloadedContent.find(d => d.Id === song.Id && d.type === 'song');
      if (existingDownload) {
        continue;
      }

      // Simulate file size
      const fileSize = Math.floor(Math.random() * 2000000) + 3000000;
      totalSize += fileSize;

      const download = {
        Id: song.Id,
        type: 'song',
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: song.duration,
        coverUrl: song.coverUrl,
        genre: song.genre,
        fileSize: fileSize,
        downloadedAt: new Date().toISOString(),
        lastPlayed: null,
        playCount: 0,
        albumId: album.Id
      };

      downloads.push(download);
    }

    // Check storage limit
    if (storageUsed + totalSize > STORAGE_LIMIT) {
      throw new Error('Storage limit exceeded');
    }

    downloadedContent.push(...downloads);
    storageUsed += totalSize;
    return downloads;
  },

  async removeDownload(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = downloadedContent.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Download not found');
    }
    
    const download = downloadedContent[index];
    storageUsed -= download.fileSize;
    downloadedContent.splice(index, 1);
    return { ...download };
  },

  async clearAll() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const clearedCount = downloadedContent.length;
    downloadedContent = [];
    storageUsed = 0;
    return { clearedCount };
  },

  async getStorageInfo() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      used: storageUsed,
      limit: STORAGE_LIMIT,
      available: STORAGE_LIMIT - storageUsed,
      usagePercentage: Math.round((storageUsed / STORAGE_LIMIT) * 100),
      totalDownloads: downloadedContent.length
    };
  },

  async searchDownloads(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!query.trim()) {
      return [...downloadedContent];
    }
    
    const searchTerm = query.toLowerCase();
    return downloadedContent.filter(download =>
      download.title.toLowerCase().includes(searchTerm) ||
      download.artist.toLowerCase().includes(searchTerm) ||
      download.album.toLowerCase().includes(searchTerm)
    );
  },

  async getDownloadsByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return downloadedContent.filter(download => download.type === type);
  },

  async updatePlayCount(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const download = downloadedContent.find(d => d.Id === parseInt(id));
    if (download) {
      download.playCount += 1;
      download.lastPlayed = new Date().toISOString();
      return { ...download };
    }
    throw new Error('Download not found');
  },

  async getRecentlyPlayed() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return downloadedContent
      .filter(d => d.lastPlayed)
      .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
      .slice(0, 10);
  },

  async getMostPlayed() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return downloadedContent
      .filter(d => d.playCount > 0)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);
  }
};

export default downloadService;