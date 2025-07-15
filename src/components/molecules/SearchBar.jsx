import { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search songs, artists, albums...", className }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center gap-2", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-surface/50 border-gray-600 focus:border-primary focus:bg-surface"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-600"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        )}
      </div>
      <Button
        type="submit"
        variant="gradient"
        size="icon"
        disabled={!query.trim()}
        className="h-10 w-10"
      >
        <ApperIcon name="Search" size={16} />
      </Button>
    </motion.form>
  );
};

export default SearchBar;