"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Avatar } from "@/src/app/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageSquare, Share2 } from "lucide-react";

const newsItems = [
  {
    title: "The Future of AI: Breaking New Boundaries",
    excerpt: "Artificial Intelligence continues to evolve at an unprecedented pace, transforming industries and creating new possibilities...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "Technology",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
    },
    stats: {
      comments: 128,
      bookmarks: 345
    }
  },
  {
    title: "Sustainable Cities: Building for Tomorrow",
    excerpt: "Urban planners are revolutionizing city design with sustainable practices and green technologies...",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop",
    category: "Environment",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop"
    },
    stats: {
      comments: 95,
      bookmarks: 230
    }
  }
];

export function NewsGrid() {
  return (
    <div className="space-y-6">
      {newsItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card>
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-4 left-4">{item.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{item.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <img src={item.author.avatar} alt={item.author.name} />
                  </Avatar>
                  <span className="text-sm font-medium">{item.author.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {item.stats.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" />
                    {item.stats.bookmarks}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}