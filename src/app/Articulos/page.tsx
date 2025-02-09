"use client";

import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "../services/NewsEverythingService";
import { Article } from "../../interface/article";
import Image from "next/image";
import ArticleList from "../components/ArticleList";
import Loading from "../components/Loading";
import NoArticlesError from "../components/NoArticlesError";
import ArticleForm from "../components/ArticleForm";
import Pagination from "../components/Pagination";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSearchParams } from "next/navigation";

const defaultSearchParams = {
  sources: "",
  q: "",
  language: "es",
  sortBy: "",
  pageSize: 9, // Artículos por página
};

const Page = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstVisit, setFirstVisit] = useState(true);
  const [imagePath, setImagePath] = useState("");
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const router = useSearchParams();
  const urlQuery = router.get("q");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedParams = sessionStorage.getItem("searchParams");
      const savedArticles = sessionStorage.getItem("articles");
      const savedCurrentPage = sessionStorage.getItem("currentPage");
      const savedTotalPages = sessionStorage.getItem("totalPages");

      setSearchParams(
        savedParams ? JSON.parse(savedParams) : defaultSearchParams
      );
      setArticles(savedArticles ? JSON.parse(savedArticles) : []);
      setCurrentPage(savedCurrentPage ? parseInt(savedCurrentPage, 10) : 1);
      setTotalPages(savedTotalPages ? parseInt(savedTotalPages, 10) : 1);
      setFirstVisit(!savedArticles);
      
    }
  }, []);

  useEffect(() => {
    if (urlQuery) {
      // Actualiza los parámetros de búsqueda con el valor de la URL
      setSearchParams((prev) => ({ ...prev, q: urlQuery }));
      // Ejecuta la búsqueda automáticamente
      handleSearch();
    }
  }, [urlQuery]); 

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e?: React.FormEvent | null) => {
    if (e) e.preventDefault();

    if (!searchParams.q.trim() && !searchParams.sources) {
      setError(
        "No se han encontrado artículos. Busque por palabra clave o seleccione una fuente."
      );
      setImagePath(getRandomImage());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchTopHeadlines({
        ...searchParams,
        pageSize: 100,
        page: 1,
      });

      if (!data.articles || data.articles.length === 0) {
        setError(
          "No se han encontrado artículos. Intente una búsqueda diferente."
        );
        setImagePath(getRandomImage());
      } else {
        setArticles(data.articles);
        const totalArticles = data.articles.length;
        const calculatedTotalPages = Math.ceil(
          totalArticles / searchParams.pageSize
        );
        setTotalPages(calculatedTotalPages);
        sessionStorage.setItem("articles", JSON.stringify(data.articles));
        sessionStorage.setItem("searchParams", JSON.stringify(searchParams));
        sessionStorage.setItem("totalPages", calculatedTotalPages.toString());
        setCurrentPage(1);
        sessionStorage.setItem("currentPage", "1");

        // Actualizamos `firstVisit` porque ya se realizó una búsqueda
        setFirstVisit(false);
      }
    } catch (err) {
      setError("Error fetching news");
      setImagePath(getRandomImage());
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedArticles = () => {
    const storedArticles = JSON.parse(
      sessionStorage.getItem("articles") || "[]"
    );
    const startIndex = (currentPage - 1) * searchParams.pageSize;
    const endIndex = Math.min(
      startIndex + searchParams.pageSize,
      storedArticles.length
    ); // Ajuste del índice final
    return storedArticles.slice(startIndex, endIndex);
  };

  const smoothScrollToTop = () => {
    const scrollDuration = 500; // Duración en milisegundos
    const scrollStep = -window.scrollY / (scrollDuration / 15); // Cantidad de desplazamiento por intervalo

    const scrollInterval = setInterval(() => {
      if (window.scrollY > 0) {
        window.scrollBy(0, scrollStep); // Desplazamos hacia arriba
      } else {
        clearInterval(scrollInterval); // Finalizamos la animación al llegar al inicio
      }
    }, 15); // Intervalo de 15ms para un desplazamiento fluido
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    sessionStorage.setItem("currentPage", page.toString());

    // Animación personalizada de desplazamiento
    smoothScrollToTop();

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getRandomImage = () =>
    `/images/ArticuloError/ArticuloError${
      Math.floor(Math.random() * 3) + 1
    }.jpg`;

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleForm
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
      />

      {loading && <Loading />}
      {!loading && firstVisit && articles.length === 0 && (
        <div className="h-screen flex flex-col items-center justify-center bg-white-100">
          <Image
            src="/images/PrimeraVista.png"
            alt="No articles found"
            width={300}
            height={300}
          />
          <h1 className="text-2xl font-bold text-green-800">
            Empieza a buscar noticias
          </h1>
        </div>
      )}

      {!loading && error && (
        <NoArticlesError message={error} imagePath={imagePath} />
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <ArticleList articles={getPaginatedArticles()} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Page;
