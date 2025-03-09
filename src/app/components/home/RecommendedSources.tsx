"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Avatar } from "@/src/app/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const recommendedSources = [
  {
    name: "TechCrunch",
    image: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=64&h=64&fit=crop",
    category: "Technology",
    followers: "2.1M"
  },
  {
    name: "Bloomberg",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64&h=64&fit=crop",
    category: "Business",
    followers: "5.3M"
  },
  {
    name: "National Geographic",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=64&h=64&fit=crop",
    category: "Science",
    followers: "4.7M"
  }
];

export function RecommendedSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recommended Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedSources.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img src={source.image} alt={source.name} />
              </Avatar>
              <div>
                <h3 className="font-medium">{source.name}</h3>
                <p className="text-sm text-muted-foreground">{source.category} • {source.followers} followers</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}