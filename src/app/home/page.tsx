"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Search,
  Clock,
  Calendar,
  BookOpen,
  TrendingUp,
  History,
  Star,
  Filter,
  ArrowRight,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/src/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { Avatar } from "@/src/app/components/ui/avatar";
import Image from "next/image";

interface Activity {
  id: string;
  type:
    | "favorite_added"
    | "favorite_removed"
    | "comment"
    | "rating_added"
    | "rating_removed"
    | "follow"
    | "unfollow"
    | "comment_reply"
    | "comment_deleted";
  sourceName: string | null;
  userName: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
}

interface ApiTrend {
  title: string;
  url: string;
}

interface FavoriteTrend {
  sourceId: string;
  sourceName: string;
  count: number;
}

interface Trends {
  api: ApiTrend[];
  favorites: FavoriteTrend[];
  comments: FavoriteTrend[];
}

type Trend = ApiTrend | FavoriteTrend;

const decorativeElements = [
  { left: "10%", top: "20%", width: "8px", height: "8px", duration: "2s" },
  { left: "20%", top: "40%", width: "12px", height: "12px", duration: "2.5s" },
  { left: "30%", top: "60%", width: "6px", height: "6px", duration: "3s" },
  { left: "40%", top: "25%", width: "10px", height: "10px", duration: "2.2s" },
  { left: "50%", top: "45%", width: "7px", height: "7px", duration: "2.8s" },
  { left: "60%", top: "65%", width: "9px", height: "9px", duration: "2.4s" },
  { left: "70%", top: "30%", width: "11px", height: "11px", duration: "2.6s" },
  { left: "80%", top: "50%", width: "8px", height: "8px", duration: "2.3s" },
  { left: "90%", top: "70%", width: "10px", height: "10px", duration: "2.7s" },
  { left: "15%", top: "35%", width: "6px", height: "6px", duration: "2.9s" },
];

const StatItem = ({
  icon,
  label,
  value,
  isVisible,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  isVisible: boolean;
}) => {
  const count = useCounter(value, 2000);

  return (
    <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="rounded-full p-3 bg-blue-100/50 dark:bg-blue-900/30">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isVisible ? count : 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const TrendsSection = () => {
  const router = useRouter();
  const [trends, setTrends] = useState<Trends>({
    api: [],
    favorites: [],
    comments: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("api");

  const handleTrendClick = (trend: Trend, type: string) => {
    if (type === "favorite" || type === "comment") {
      const sourceTrend = trend as FavoriteTrend;
      router.push(`/sources/${sourceTrend.sourceId}`);
    } else if (type === "api") {
      const apiTrend = trend as ApiTrend;
      window.open(apiTrend.url, "_blank");
    }
  };

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch("/api/trends");
        const { topFavorites, topCommented, newsApiTrends } =
          await response.json();

        setTrends({
          api: newsApiTrends.slice(0, 8),
          favorites: topFavorites
            .map(
              (item: {
                _count: { sourceId: number };
                sourceName: string;
                sourceId: string;
              }) => ({
                ...item,
                count: item._count.sourceId,
              })
            )
            .slice(0, 8),
          comments: topCommented
            .map(
              (item: {
                _count: { sourceId: number };
                sourceName: string;
                sourceId: string;
              }) => ({
                ...item,
                count: item._count.sourceId,
              })
            )
            .slice(0, 8),
        });
      } catch (error) {
        console.error("Error fetching trends:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Tendencias
          </CardTitle>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mt-2"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <TabsTrigger
                value="api"
                className="text-gray-700 dark:text-gray-300"
              >
                Noticias
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="text-gray-700 dark:text-gray-300"
              >
                Favoritos
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="text-gray-700 dark:text-gray-300"
              >
                Comentarios
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === "api" && (
          <>
            {trends.api.map((trend, i) => (
              <div
                key={i}
                className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                onClick={() => handleTrendClick(trend, "api")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </span>
                    <span className="text-sm font-medium line-clamp-1 text-gray-800 dark:text-gray-200">
                      {trend.title}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    Nuevo
                  </Badge>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "favorites" && (
          <>
            {trends.favorites.map((trend, i) => (
              <div
                key={i}
                className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                onClick={() => handleTrendClick(trend, "favorite")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {trend.sourceName}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900/30 text-red-500"
                  >
                    {trend.count} ♥
                  </Badge>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "comments" && (
          <>
            {trends.comments.map((trend, i) => (
              <div
                key={i}
                className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                onClick={() => handleTrendClick(trend, "comment")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {trend.sourceName}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900/30 text-green-500"
                  >
                    {trend.count} 💬
                  </Badge>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  return {
    scrollRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
  };
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState({
    stats: false,
    featured: false,
    collections: false,
    recent: false,
  });
  const [userStats, setUserStats] = useState({
    favoriteCount: 0,
    activityCount: 0,
    totalInteractions: 0,
    activeDays: 0,
  });
  const [followingActivity, setFollowingActivity] = useState<Activity[]>([]);
  const [isLoadingFollowingActivity, setIsLoadingFollowingActivity] =
    useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const itemsPerPage = 5;
  const [categories, setCategories] = useState<string[]>([]);

  const horizontalScroll = useHorizontalScroll();

  useEffect(() => {
    const loadStats = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/users/stats");
          const data = await response.json();
          setUserStats({
            favoriteCount: data.favoriteCount,
            activityCount: data.activityCount,
            totalInteractions: data.totalInteractions,
            activeDays: data.activeDays,
          });
        } catch (error) {
          console.error("Error loading stats:", error);
        }
      }
    };
    loadStats();
  }, [session]);

  useEffect(() => {
    const loadFollowingActivity = async () => {
      if (session?.user?.id) {
        setIsLoadingFollowingActivity(true);
        try {
          const response = await fetch(
            `/api/activity/following?page=${currentPage}&limit=${itemsPerPage}`
          );
          if (response.ok) {
            const { data, total } = await response.json();
            if (Array.isArray(data)) {
              setFollowingActivity(data);
              setTotalActivities(total);
            }
          }
        } catch (error) {
          console.error("Error loading following activity:", error);
        } finally {
          setIsLoadingFollowingActivity(false);
        }
      }
    };
    loadFollowingActivity();
  }, [session, currentPage]);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;

      const statsSection = document.getElementById("stats-section");
      const featuredSection = document.getElementById("featured-section");
      const collectionsSection = document.getElementById("collections-section");
      const recentSection = document.getElementById("recent-section");

      if (statsSection && scrollPosition > statsSection.offsetTop + 100) {
        setIsVisible((prev) => ({ ...prev, stats: true }));
      }
      if (featuredSection && scrollPosition > featuredSection.offsetTop + 100) {
        setIsVisible((prev) => ({ ...prev, featured: true }));
      }
      if (
        collectionsSection &&
        scrollPosition > collectionsSection.offsetTop + 100
      ) {
        setIsVisible((prev) => ({ ...prev, collections: true }));
      }
      if (recentSection && scrollPosition > recentSection.offsetTop + 100) {
        setIsVisible((prev) => ({ ...prev, recent: true }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && mounted) {
      redirect("/");
    }
  }, [status, mounted]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const PaginationControls = () => {
    const totalPages = Math.ceil(totalActivities / itemsPerPage) || 1;

    return (
      <div className="flex justify-center gap-2 mt-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        <span className="flex items-center px-4 text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    );
  };

  if (!mounted || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
          <p className="mt-4 text-blue-100 font-medium">
            Cargando tu experiencia personalizada...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-blue-800/20">
      <section className="relative min-h-[50vh] w-full overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900">
        <div className="absolute inset-0 overflow-hidden">
          {decorativeElements.map((element, i) => (
            <div
              key={i}
              className="absolute animate-pulse hidden sm:block"
              style={{
                left: element.left,
                top: element.top,
                width: element.width,
                height: element.height,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                animation: `pulse ${element.duration} infinite`,
              }}
            />
          ))}
          <div className="absolute top-8 sm:top-1/4 right-[10%] w-16 h-16 sm:w-24 sm:h-24 md:w-40 md:h-40 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full opacity-40 blur-lg animate-pulse"></div>
          <div className="absolute top-16 sm:bottom-1/3 left-[15%] w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-300/10 to-cyan-400/10 rounded-full opacity-40 blur-lg animate-pulse"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Bienvenido, {session?.user?.name || "Investigador"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl">
              Continúa explorando nuestra colección de documentos históricos y
              descubre nuevas perspectivas del pasado.
            </p>

            <div className="relative max-w-2xl">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Buscar por título, autor, fecha o palabra clave..."
                  className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus-visible:ring-white/30 focus-visible:border-white/30"
                />
                <Button className="ml-2 bg-white text-blue-600 hover:bg-blue-50">
                  <Search className="h-4 w-4 mr-2" /> Buscar
                </Button>
              </div>
              <div className="flex items-center mt-2 text-sm text-blue-200">
                <Button
                  variant="link"
                  className="text-blue-200 hover:text-white p-0 h-auto"
                >
                  <Filter className="h-3 w-3 mr-1" /> Búsqueda avanzada
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto text-white"
          >
            <path
              fill="currentColor"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      <section id="stats-section" className="py-12 sm:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible.stats ? 1 : 0,
              y: isVisible.stats ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-blue-600" />,
                label: "Interacciones",
                value: userStats.totalInteractions,
              },
              {
                icon: <Heart className="h-5 w-5 text-red-500 fill-red-500" />,
                label: "Favoritos",
                value: userStats.favoriteCount,
              },
              {
                icon: <History className="h-6 w-6 text-green-600" />,
                label: "Actividad Reciente",
                value: userStats.activityCount,
              },
              {
                icon: <Calendar className="h-6 w-6 text-purple-600" />,
                label: "Días Activo",
                value: userStats.activeDays,
              },
            ].map((stat, i) => (
              <StatItem
                key={i}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                isVisible={isVisible.stats}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="featured-section"
        className="py-12 sm:py-16 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/30 dark:to-indigo-900/30 relative"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Artículos Destacados
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Selección especial de documentos históricos relevantes
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 md:mt-0 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
              onClick={() => router.push("/Articulos")}
            >
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible.featured ? 1 : 0,
              y: isVisible.featured ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                title: "La Revolución Industrial en España",
                excerpt:
                  "Análisis detallado del impacto de la industrialización en la península ibérica durante el siglo XIX.",
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                date: "12 Jun 1892",
                source: "El Imparcial",
                category: "Economía",
              },
              {
                title: "Crónicas de la Guerra Civil",
                excerpt:
                  "Testimonios y reportajes periodísticos sobre los acontecimientos más relevantes del conflicto.",
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                date: "3 Mar 1937",
                source: "ABC",
                category: "Política",
              },
              {
                title: "El Descubrimiento de la Penicilina",
                excerpt:
                  "Cobertura periodística sobre uno de los avances médicos más importantes del siglo XX.",
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                date: "24 Sep 1945",
                source: "La Vanguardia",
                category: "Ciencia",
              },
            ].map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isVisible.featured ? 1 : 0,
                  y: isVisible.featured ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/articulos/${i}`)}
              >
                <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-white/80">
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Fuente: {article.source}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400 p-0 h-auto"
                      >
                        Leer más
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="collections-section" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible.collections ? 1 : 0,
              y: isVisible.collections ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              ref={horizontalScroll.scrollRef}
              className={`flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory ${
                horizontalScroll.isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={horizontalScroll.onMouseDown}
              onMouseUp={horizontalScroll.onMouseUp}
              onMouseLeave={horizontalScroll.onMouseUp}
              onMouseMove={horizontalScroll.onMouseMove}
              onTouchStart={horizontalScroll.onTouchStart}
              onTouchMove={horizontalScroll.onTouchMove}
              onTouchEnd={horizontalScroll.onTouchEnd}
            >
              {categories.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isVisible.collections ? 1 : 0,
                    scale: isVisible.collections ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="snap-start flex-shrink-0"
                  style={{ width: "280px" }}
                >
                  <Image
                    src="/category-bg.jpg"
                    alt={category}
                    width={280}
                    height={160}
                    className="h-48 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="recent-section"
        className="py-12 sm:py-16 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/30 dark:to-indigo-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isVisible.recent ? 1 : 0,
                x: isVisible.recent ? 0 : -20,
              }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="border-blue-100 dark:border-blue-900/30 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Actividad Reciente de Usuarios Seguidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingFollowingActivity ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                      <p className="text-gray-600 mt-2">
                        Cargando actividades...
                      </p>
                    </div>
                  ) : followingActivity.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                      No hay actividad reciente de los usuarios que sigues.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {followingActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <Image
                                  src={
                                    activity.user.image || "/default-avatar.png"
                                  }
                                  alt={activity.user.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full"
                                />
                              </Avatar>
                            </div>
                            <div className="flex-shrink-0">
                              {(() => {
                                switch (activity.type) {
                                  case "favorite_added":
                                    return (
                                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                                    );
                                  case "favorite_removed":
                                    return (
                                      <Heart className="h-5 w-5 text-red-500" />
                                    );
                                  case "comment":
                                    return (
                                      <MessageSquare className="h-5 w-5 text-green-500" />
                                    );
                                  case "rating_added":
                                    return (
                                      <div className="relative flex items-center justify-center">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <Plus className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                                      </div>
                                    );
                                  case "rating_removed":
                                    return (
                                      <div className="relative flex items-center justify-center">
                                        <Star className="h-5 w-5 text-purple-500" />
                                        <Minus className="h-3 w-3 absolute -top-1 -right-1 text-purple-500" />
                                      </div>
                                    );
                                  case "follow":
                                    return (
                                      <User2 className="h-5 w-5 text-blue-500" />
                                    );
                                  case "unfollow":
                                    return (
                                      <User2 className="h-5 w-5 text-red-500" />
                                    );
                                  case "comment_reply":
                                    return (
                                      <MessageSquare className="h-5 w-5 text-green-500" />
                                    );
                                  case "comment_deleted":
                                    return (
                                      <MessageSquare className="h-5 w-5 text-red-500" />
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                <span className="font-medium">
                                  {activity.user.username}
                                </span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {(() => {
                                    switch (activity.type) {
                                      case "favorite_added":
                                        return "agregó un favorito";
                                      case "favorite_removed":
                                        return "eliminó un favorito";
                                      case "comment":
                                        return "comentó en";
                                      case "rating_added":
                                        return "calificó";
                                      case "rating_removed":
                                        return "eliminó la valoración de";
                                      case "follow":
                                        return "comenzó a seguir a";
                                      case "unfollow":
                                        return "dejó de seguir a";
                                      case "comment_reply":
                                        return "respondió a un comentario en";
                                      case "comment_deleted":
                                        return "eliminó un comentario en";
                                      default:
                                        return "";
                                    }
                                  })()}
                                </span>{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {activity.sourceName || activity.userName}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(activity.createdAt).toLocaleString(
                                  "es-ES",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!isLoadingFollowingActivity &&
                        followingActivity.length > 0 &&
                        totalActivities > itemsPerPage && (
                          <PaginationControls />
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isVisible.recent ? 1 : 0,
                x: isVisible.recent ? 0 : 20,
              }}
              transition={{ duration: 0.5 }}
            >
              <TrendsSection />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
