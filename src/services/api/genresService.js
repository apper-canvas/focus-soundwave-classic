// Dynamic import to handle JSON loading properly in Vite
let genresData = [];
let isLoading = true;
let loadError = null;

// Load genres data with error handling
const loadGenresData = async () => {
  try {
    const module = await import('@/services/mockData/genres.json');
    genresData = module.default || [];
    isLoading = false;
    return genresData;
  } catch (error) {
    console.error('Failed to load genres data:', error);
    loadError = error;
    isLoading = false;
    genresData = []; // Fallback to empty array
    return genresData;
  }
};

// Initialize data loading
loadGenresData();

const genresService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...genresData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const genre = genresData.find(g => g.Id === parseInt(id));
    if (!genre) {
      throw new Error('Genre not found');
    }
    return { ...genre };
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return genresData.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm)
    );
  },

  async create(genreData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newGenre = {
      ...genreData,
      Id: Math.max(...genresData.map(g => g.Id)) + 1
    };
    genresData.push(newGenre);
    return { ...newGenre };
  },

  async update(id, genreData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = genresData.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Genre not found');
    }
    genresData[index] = { ...genresData[index], ...genreData };
    return { ...genresData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = genresData.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Genre not found');
    }
    const deletedGenre = genresData.splice(index, 1)[0];
    return { ...deletedGenre };
  }
};

export default genresService;