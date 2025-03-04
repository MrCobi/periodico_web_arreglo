import { fetchSourceById, fetchArticlesBySource } from "@/lib/api";
import { Source } from "@/src/interface/source";
import { Article } from "@/src/interface/article";
import SourcePageClient from "./SourcePageClient";

export type Props = { params: { id: string } };

export default async function SourcePage({ params }: Props) {
  const { id: sourceId } = params;

  if (!sourceId || sourceId.trim() === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900">
          ID de fuente no proporcionado.
        </h1>
      </div>
    );
  }

  const source: Source | null = await fetchSourceById(sourceId);

  if (!source) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900">
          No se encontró la fuente solicitada.
        </h1>
      </div>
    );
  }

  const articles: Article[] = await fetchArticlesBySource(sourceId);

  return <SourcePageClient source={source} articles={articles} />;
}
