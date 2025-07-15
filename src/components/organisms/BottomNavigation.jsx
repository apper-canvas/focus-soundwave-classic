import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = ({ className }) => {
  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: "Home" 
    },
    { 
      path: "/search", 
      label: "Search", 
      icon: "Search" 
    },
{ 
      path: "/library", 
      label: "Library", 
      icon: "Library" 
    },
    { 
      path: "/downloads", 
      label: "Downloads", 
      icon: "Download" 
    },
    { 
      path: "/profile", 
      label: "Profile", 
      icon: "User" 
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-gray-700",
        className
      )}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 min-w-0 text-center transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-gray-400 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? "text-primary" : "text-gray-400"}
                  />
                </motion.div>
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-1 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;