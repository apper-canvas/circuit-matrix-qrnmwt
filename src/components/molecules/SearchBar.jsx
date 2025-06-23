import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const searchBarVariants = {
    focused: { scale: 1.02 },
    unfocused: { scale: 1 }
  };

  return (
    <motion.div
      variants={searchBarVariants}
      animate={isFocused ? "focused" : "unfocused"}
      transition={{ duration: 0.2 }}
      className={`relative ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            icon="Search"
            iconPosition="left"
            className="pr-10"
          />
          {query && (
            <button
              type="button"
onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          icon="Search"
          className="px-4"
        >
          Search
        </Button>
      </form>
    </motion.div>
  );
};

export default SearchBar;