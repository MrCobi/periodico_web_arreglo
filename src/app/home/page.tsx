"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [trends, setTrends] = useState<
    Array<{
      type: string;
      data: any;
      count?: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTrendClick = (trend: any) => {
    if (trend.type === "favorite") {
      router.push(`/sources/${trend.data.sourceId}`);
    } else if (trend.type === "news_api") {
      if (trend.data.localSourceId) {
        router.push(`/articulos/${trend.data.localSourceId}`);
      } else {
        window.open(trend.data.url, "_blank");
      }
    }
  };

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch("/api/trends");
        const { topFavorites, topCommented, newsApiTrends } =
          await response.json();

        const mergedTrends = [
          ...topFavorites.map((item: any) => ({
            type: "favorite",
            data: item,
            count: item._count.sourceId,
          })),
          ...newsApiTrends.map((article: any) => ({
            type: "news_api",
            data: article,
          })),
        ];

        setTrends(mergedTrends);
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
    <Card className="border-blue-100 dark:border-blue-900/30 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Tendencias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trends.map((trend, i) => (
            <div
              key={i}
              className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              onClick={() => handleTrendClick(trend)}
            >
              {trend.type === "favorite" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">
                      {trend.data.sourceId.substring(0, 15)}...
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900/30"
                  >
                    {trend.count} favoritos
                  </Badge>
                </div>
              )}

              {trend.type === "news_api" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </span>
                    <span className="text-sm font-medium line-clamp-1">
                      {trend.data.title}
                    </span>
                  </div>
                  <Badge variant="outline">Nuevo</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
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
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

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
            className="w-full h-auto"
          >
            <path
              fill="currentColor"
              className="text-white dark:text-gray-900"
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
                value: userStats.totalInteractions, // Suma de favoritos + comentarios + ratings
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
                      width={800} // Agregar
                      height={500} // Agregar
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Colecciones Temáticas
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explora nuestros documentos organizados por temas
              </p>
            </div>
            <Tabs defaultValue="all" className="mt-4 md:mt-0">
              <TabsList className="bg-blue-100/50 dark:bg-blue-900/30">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="politics">Política</TabsTrigger>
                <TabsTrigger value="culture">Cultura</TabsTrigger>
                <TabsTrigger value="science">Ciencia</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible.collections ? 1 : 0,
              y: isVisible.collections ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Guerra Civil Española",
                count: 1243,
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                color: "from-red-500 to-orange-500",
              },
              {
                title: "Transición Democrática",
                count: 856,
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                color: "from-blue-500 to-indigo-500",
              },
              {
                title: "Movimientos Culturales",
                count: 723,
                image:
                  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&h=500&fit=crop",
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Avances Científicos",
                count: 512,
                image:
                  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
                color: "from-green-500 to-teal-500",
              },
            ].map((collection, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isVisible.collections ? 1 : 0,
                  y: isVisible.collections ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() =>
                  router.push(
                    `/colecciones/${collection.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
              >
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    width={400} // Agregar
                    height={300} // Agregar
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-70 group-hover:opacity-80 transition-opacity`}
                  ></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-white/90">
                      {collection.count} documentos
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-white/20 border-white/40 text-white hover:bg-white/30 w-full sm:w-auto"
                    >
                      Explorar colección
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
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
                              {activity.type === "favorite_added" && (
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                              )}
                              {activity.type === "favorite_removed" && (
                                <Heart className="h-5 w-5 text-red-500" />
                              )}
                              {activity.type === "comment" && (
                                <MessageSquare className="h-5 w-5 text-green-500" />
                              )}
                              {activity.type === "rating_added" && (
                                <div className="relative flex items-center justify-center">
                                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                  <Plus className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                                </div>
                              )}
                              {activity.type === "rating_removed" && (
                                <div className="relative flex items-center justify-center">
                                  <Star className="h-5 w-5 text-purple-500" />
                                  <Minus className="h-3 w-3 absolute -top-1 -right-1 text-purple-500" />
                                </div>
                              )}
                              {activity.type === "follow" && (
                                <User2 className="h-5 w-5 text-blue-500" />
                              )}
                              {activity.type === "unfollow" && (
                                <User2 className="h-5 w-5 text-red-500" />
                              )}
                              {activity.type === "comment_reply" && (
                                <MessageSquare className="h-5 w-5 text-green-500" />
                              )}
                              {activity.type === "comment_deleted" && (
                                <MessageSquare className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                <span className="font-medium">
                                  {activity.user.username}
                                </span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {activity.type === "favorite_added" &&
                                    "agregó un favorito"}
                                  {activity.type === "favorite_removed" &&
                                    "eliminó un favorito"}
                                  {activity.type === "comment" && "comentó en"}
                                  {activity.type === "rating_added" &&
                                    "calificó"}
                                  {activity.type === "rating_removed" &&
                                    "eliminó la valoración de"}
                                  {activity.type === "follow" &&
                                    "comenzó a seguir a"}
                                  {activity.type === "unfollow" &&
                                    "dejó de seguir a"}
                                  {activity.type === "comment_reply" &&
                                    "respondió a un comentario en"}
                                  {activity.type === "comment_deleted" &&
                                    "eliminó un comentario en"}
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
