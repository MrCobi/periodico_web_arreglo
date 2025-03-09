"use client";

import { User } from "next-auth";
import { motion } from "framer-motion";
import { Card } from "@/src/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar";
import { 
  UserCircle2, 
  Users, 
  Newspaper, 
  Star,
  TrendingUp,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

interface UserStatsProps {
  user: User | undefined;
}

export function UserStats({ user }: UserStatsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: <Newspaper className="h-5 w-5 text-blue-600" />, label: "Fuentes", value: 24 },
    { icon: <Users className="h-5 w-5 text-green-600" />, label: "Seguidores", value: 156 },
    { icon: <UserCircle2 className="h-5 w-5 text-purple-600" />, label: "Siguiendo", value: 89 },
    { icon: <Star className="h-5 w-5 text-yellow-600" />, label: "Valoraciones", value: 432 },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 backdrop-blur-lg bg-white/80 dark:bg-black/50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user?.name || "Usuario"}
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-black/50">
                  {stat.icon}
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="icon" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}