import { motion } from "framer-motion";
import AlbumCard from "@/components/molecules/AlbumCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const AlbumGrid = ({ 
  albums = [],
  loading = false,
  error = null,
  onRetry,
  onPlay,
  onToggleFavorite,
  favoriteIds = [],
  emptyMessage = "No albums found",
  emptyIcon = "Disc"
}) => {
  if (loading) {
    return <Loading type="album" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load albums"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (albums.length === 0) {
    return (
      <Empty 
        title={emptyMessage}
        message="Discover new albums by exploring different genres and artists."
        icon={emptyIcon}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      {albums.map((album, index) => (
        <motion.div
          key={album.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <AlbumCard
            album={album}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favoriteIds.includes(album.Id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AlbumGrid;