import { motion } from "framer-motion";
import TrackItem from "@/components/molecules/TrackItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TrackList = ({ 
  tracks = [],
  loading = false,
  error = null,
  onRetry,
  currentSong,
  isPlaying,
  onPlay,
  onPause,
  onAddToPlaylist,
  onToggleFavorite,
  favoriteIds = [],
  showAlbum = true,
  emptyMessage = "No tracks found",
  emptyIcon = "Music"
}) => {
  if (loading) {
    return <Loading type="track" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load tracks"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (tracks.length === 0) {
    return (
      <Empty 
        title={emptyMessage}
        message="Start building your music library by searching for your favorite songs."
        icon={emptyIcon}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      {tracks.map((track, index) => (
        <motion.div
          key={track.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TrackItem
            track={track}
            isPlaying={isPlaying && currentSong?.Id === track.Id}
            onPlay={onPlay}
            onPause={onPause}
            onAddToPlaylist={onAddToPlaylist}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favoriteIds.includes(track.Id)}
            showAlbum={showAlbum}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrackList;