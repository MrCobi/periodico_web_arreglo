"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { UserStats } from "@/src/app/components/home/UserStats";
import { NewsGrid } from "../components/home/NewsGrid";
import { ActivityStream } from "@/src/app/components/home/ActivityStream";
import { SearchBar } from "@/src/app/components/home/SearchBar";
import { RecommendedSources } from "../components/home/RecommendedSources";
import { TrendingTopics } from "@/src/app/components/home/TrendingTopics";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (!mounted || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/90">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <UserStats user={session?.user} />
          <SearchBar />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-3 space-y-6"
          >
            <TrendingTopics />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-6 space-y-6"
          >
            <NewsGrid />
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="xl:col-span-3 space-y-6"
          >
            <ActivityStream />
            <RecommendedSources />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}