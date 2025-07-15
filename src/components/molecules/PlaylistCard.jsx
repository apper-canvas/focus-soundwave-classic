import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PlaylistCard = ({ 
  playlist, 
  onPlay, 
  onEdit,
  onDelete,
  className 
}) => {
  const trackCount = playlist.songs?.length || 0;

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
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-4 right-4">
            <Button
              variant="accent"
              size="icon"
              onClick={() => onPlay?.(playlist)}
              className="w-12 h-12 shadow-lg"
            >
              <ApperIcon name="Play" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-white truncate mb-1">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-400 truncate mb-2">
          {trackCount} {trackCount === 1 ? "song" : "songs"}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(playlist)}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
            >
              <ApperIcon name="Edit" size={14} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(playlist)}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;