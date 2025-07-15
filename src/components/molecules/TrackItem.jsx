import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TrackItem = ({ 
  track, 
  isPlaying = false, 
  onPlay, 
  onPause,
  onAddToPlaylist,
  onToggleFavorite,
  isFavorite = false,
  showAlbum = true,
  className 
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.(track);
    } else {
      onPlay?.(track);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg bg-surface/50 backdrop-blur-sm border border-gray-700/50 hover:bg-surface hover:border-gray-600 transition-all duration-200",
        isPlaying && "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50",
        className
      )}
    >
      <div className="relative">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="w-8 h-8 text-white hover:bg-white/20"
          >
            <ApperIcon name={isPlaying ? "Pause" : "Play"} size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-white truncate",
          isPlaying && "text-primary"
        )}>
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          {track.artist}
          {showAlbum && track.album && ` • ${track.album}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite?.(track)}
          className={cn(
            "w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity",
            isFavorite && "opacity-100 text-accent"
          )}
        >
          <ApperIcon name={isFavorite ? "Heart" : "Heart"} size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAddToPlaylist?.(track)}
          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
        
        <span className="text-sm text-gray-400 min-w-[40px] text-right">
          {formatDuration(track.duration)}
        </span>
      </div>
    </motion.div>
  );
};

export default TrackItem;