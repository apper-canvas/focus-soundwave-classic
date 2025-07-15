import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const GenreCard = ({ 
  genre, 
  onClick, 
  className 
}) => {
  const gradients = {
    "Pop": "from-pink-500 to-purple-500",
    "Rock": "from-red-500 to-orange-500",
    "Hip-Hop": "from-yellow-500 to-red-500",
    "Electronic": "from-blue-500 to-purple-500",
    "Jazz": "from-green-500 to-blue-500",
    "Classical": "from-purple-500 to-pink-500",
    "R&B": "from-orange-500 to-red-500",
    "Country": "from-yellow-500 to-green-500",
    "Alternative": "from-gray-500 to-purple-500",
    "Indie": "from-teal-500 to-blue-500",
  };

  const gradient = gradients[genre.name] || "from-primary to-secondary";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(genre)}
      className={cn(
        "relative p-6 rounded-lg bg-gradient-to-br overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200",
        gradient,
        className
      )}
    >
      <div className="relative z-10">
        <h3 className="text-xl font-display font-bold text-white mb-2">
          {genre.name}
        </h3>
        <p className="text-sm text-white/80">
          {genre.trackCount} {genre.trackCount === 1 ? "song" : "songs"}
        </p>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
      
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full transform rotate-45"></div>
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
    </motion.div>
  );
};

export default GenreCard;