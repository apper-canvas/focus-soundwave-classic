import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "track") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-surface rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer w-1/2"></div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "album") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg shimmer"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "playlist") {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer w-48"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="space-y-3">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer"></div>
                    <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded shimmer w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow"
      >
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-8 h-8 bg-white rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default Loading;