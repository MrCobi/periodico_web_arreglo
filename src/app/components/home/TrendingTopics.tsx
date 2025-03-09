"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { TrendingUp } from "lucide-react";

const trendingTopics = [
  {
    name: "Artificial Intelligence",
    count: 12500,
    trend: "+25%",
    category: "Technology"
  },
  {
    name: "Climate Change",
    count: 8300,
    trend: "+18%",
    category: "Environment"
  },
  {
    name: "Space Exploration",
    count: 6200,
    trend: "+15%",
    category: "Science"
  },
  {
    name: "Quantum Computing",
    count: 4100,
    trend: "+12%",
    category: "Technology"
  },
  {
    name: "Renewable Energy",
    count: 3800,
    trend: "+10%",
    category: "Environment"
  }
];

export function TrendingTopics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{topic.name}</h3>
              <Badge variant="secondary">{topic.trend}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{topic.category}</span>
              <span>{topic.count.toLocaleString()} articles</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}