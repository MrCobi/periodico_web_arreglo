"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { UserCard } from "@/src/app/components/UserCard";
import { FollowButton } from "@/src/app/components/FollowButton";
import { Skeleton } from "@/src/app/components/ui/skeleton";
import { useToast } from "@/src/app/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";

type User = {
  id: string;
  name: string;
  username: string;
  bio?: string;
  image: string;
};

export default function ExplorePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/suggestions?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`
        }
      });

      if (!response.ok) throw new Error("Error loading suggestions");
      
      const { data } = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Error loading suggested users");
      toast({
        title: "Error",
        description: "Could not load suggestions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, toast, searchQuery]);

  useEffect(() => {
    if (session) loadSuggestions();
  }, [session, loadSuggestions]);

  const handleFollowUpdate = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Success!",
      description: "Relationship updated successfully"
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 text-center text-destructive"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-[15%] w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Descubir Usuarios</h1>
            </div>
            
            <div className="w-full md:w-96 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Buscar por nombre, nombre de usuario o bio..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-background/80 backdrop-blur-sm border-border focus-visible:border-blue-300 dark:focus-visible:border-blue-700 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="h-[220px] w-full rounded-xl bg-muted/50" 
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-6 rounded-full bg-blue-100/50 dark:bg-blue-900/30 mb-4">
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg text-muted-foreground">
                {searchQuery ? 
                  "No results found for your search" : 
                  "No suggested users available"}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserCard
                    user={user}
                    action={
                      <FollowButton 
                        targetUserId={user.id}
                        onSuccess={() => handleFollowUpdate(user.id)}
                      />
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}