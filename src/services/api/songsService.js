import songsData from '@/services/mockData/songs.json';

const songsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...songsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const song = songsData.find(s => s.Id === parseInt(id));
    if (!song) {
      throw new Error('Song not found');
    }
    return { ...song };
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return songsData.filter(song =>
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.album.toLowerCase().includes(searchTerm)
    );
  },

  async getByGenre(genre) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return songsData.filter(song => 
      song.genre.toLowerCase() === genre.toLowerCase()
    );
  },

  async create(songData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSong = {
      ...songData,
      Id: Math.max(...songsData.map(s => s.Id)) + 1
    };
    songsData.push(newSong);
    return { ...newSong };
  },

  async update(id, songData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = songsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Song not found');
    }
    songsData[index] = { ...songsData[index], ...songData };
    return { ...songsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = songsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Song not found');
    }
    const deletedSong = songsData.splice(index, 1)[0];
    return { ...deletedSong };
  }
};

export default songsService;