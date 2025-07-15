import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBack,
  actions = [],
  className 
}) => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-gray-700",
        className
      )}
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="w-8 h-8 text-gray-400 hover:text-white"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "ghost"}
                  size="icon"
                  onClick={action.onClick}
                  className="w-8 h-8 text-gray-400 hover:text-white"
                >
                  <ApperIcon name={action.icon} size={20} />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;