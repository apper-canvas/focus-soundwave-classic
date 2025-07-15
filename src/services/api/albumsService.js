import albumsData from '@/services/mockData/albums.json';

const albumsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...albumsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const album = albumsData.find(a => a.Id === parseInt(id));
    if (!album) {
      throw new Error('Album not found');
    }
    return { ...album };
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return albumsData.filter(album =>
      album.name.toLowerCase().includes(searchTerm) ||
      album.artist.toLowerCase().includes(searchTerm)
    );
  },

  async getByArtist(artist) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return albumsData.filter(album => 
      album.artist.toLowerCase() === artist.toLowerCase()
    );
  },

  async create(albumData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAlbum = {
      ...albumData,
      Id: Math.max(...albumsData.map(a => a.Id)) + 1
    };
    albumsData.push(newAlbum);
    return { ...newAlbum };
  },

  async update(id, albumData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = albumsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Album not found');
    }
    albumsData[index] = { ...albumsData[index], ...albumData };
    return { ...albumsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = albumsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Album not found');
    }
    const deletedAlbum = albumsData.splice(index, 1)[0];
    return { ...deletedAlbum };
  }
};

export default albumsService;