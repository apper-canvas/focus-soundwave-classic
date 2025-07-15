import { motion } from "framer-motion";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PlaylistGrid = ({ 
  playlists = [],
  loading = false,
  error = null,
  onRetry,
  onPlay,
  onEdit,
  onDelete,
  emptyMessage = "No playlists found",
  emptyIcon = "ListMusic"
}) => {
  if (loading) {
    return <Loading type="album" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load playlists"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (playlists.length === 0) {
    return (
      <Empty 
        title={emptyMessage}
        message="Create your first playlist to organize your favorite songs."
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
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <PlaylistCard
            playlist={playlist}
            onPlay={onPlay}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PlaylistGrid;