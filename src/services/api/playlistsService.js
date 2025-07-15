import playlistsData from '@/services/mockData/playlists.json';

const playlistsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...playlistsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const playlist = playlistsData.find(p => p.Id === parseInt(id));
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    return { ...playlist };
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return playlistsData.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm) ||
      playlist.description.toLowerCase().includes(searchTerm)
    );
  },

  async getPublicPlaylists() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return playlistsData.filter(playlist => playlist.isPublic);
  },

  async create(playlistData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPlaylist = {
      ...playlistData,
      Id: Math.max(...playlistsData.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    playlistsData.push(newPlaylist);
    return { ...newPlaylist };
  },

  async update(id, playlistData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = playlistsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    playlistsData[index] = { ...playlistsData[index], ...playlistData };
    return { ...playlistsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = playlistsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    const deletedPlaylist = playlistsData.splice(index, 1)[0];
    return { ...deletedPlaylist };
  },

  async addSongToPlaylist(playlistId, song) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const playlist = playlistsData.find(p => p.Id === parseInt(playlistId));
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    if (!playlist.songs.find(s => s.Id === song.Id)) {
      playlist.songs.push(song);
    }
    return { ...playlist };
  },

  async removeSongFromPlaylist(playlistId, songId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const playlist = playlistsData.find(p => p.Id === parseInt(playlistId));
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    playlist.songs = playlist.songs.filter(s => s.Id !== parseInt(songId));
    return { ...playlist };
  }
};

export default playlistsService;