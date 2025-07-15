import { motion } from "framer-motion";
import GenreCard from "@/components/molecules/GenreCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const GenreGrid = ({ 
  genres = [],
  loading = false,
  error = null,
  onRetry,
  onGenreClick,
  emptyMessage = "No genres found"
}) => {
  if (loading) {
    return <Loading type="album" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load genres"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (genres.length === 0) {
    return (
      <Empty 
        title={emptyMessage}
        message="Explore different music genres to discover new artists and songs."
        icon="Music"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {genres.map((genre, index) => (
        <motion.div
          key={genre.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <GenreCard
            genre={genre}
            onClick={onGenreClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GenreGrid;