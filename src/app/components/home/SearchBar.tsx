"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Card } from "@/src/app/components/ui/card";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full lg:w-96">
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? "100%" : "auto" }}
        className="relative"
      >
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Buscar fuentes, artículos..."
            className="pr-10 bg-white/80 dark:bg-black/50 backdrop-blur-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
          />
          <div className="absolute right-0 flex items-center gap-1 pr-2">
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card className="p-4 shadow-lg backdrop-blur-lg bg-white/80 dark:bg-black/50">
                <p className="text-sm text-muted-foreground">
                  Resultados para "{searchQuery}"...
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}