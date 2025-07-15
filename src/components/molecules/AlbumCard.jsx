import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AlbumCard = ({ 
  album, 
  onPlay, 
  onToggleFavorite,
  onDownloadAlbum,
  isFavorite = false,
  isDownloaded = false,
  className 
}) => {
  const trackCount = album.songs?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group relative bg-surface/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:bg-surface hover:border-gray-600 transition-all duration-200",
        className
      )}
    >
      <div className="relative aspect-square">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-4 right-4">
            <Button
              variant="accent"
              size="icon"
              onClick={() => onPlay?.(album)}
              className="w-12 h-12 shadow-lg"
            >
              <ApperIcon name="Play" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-white truncate mb-1">
          {album.name}
        </h3>
        <p className="text-sm text-gray-400 truncate mb-2">
          {album.artist}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {album.releaseYear} • {trackCount} {trackCount === 1 ? "song" : "songs"}
          </span>
<div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite?.(album)}
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
              onClick={() => onDownloadAlbum?.(album)}
              className={cn(
                "w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity",
                isDownloaded && "opacity-100 text-success"
              )}
            >
              <ApperIcon name={isDownloaded ? "Check" : "Download"} size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlbumCard;