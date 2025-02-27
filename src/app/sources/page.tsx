// app/sources/page.tsx
import { Source } from "@/src/interface/source";
import prisma from "@/lib/db";
import SourcesList from "@/src/app/components/SourceList"; // Importa el Client Component

// Función para obtener todas las fuentes (periódicos) desde la base de datos
async function fetchAllSources(): Promise<Source[]> {
  try {
    const sources = await prisma.source.findMany();
    return sources;
  } catch (error) {
    console.error("Error fetching sources:", error);
    return [];
  }
}

export default async function SourcesPage() {
  // Obtener todas las fuentes
  const sources = await fetchAllSources();

  // Pasa los datos al Client Component
  return <SourcesList sources={sources} />;
}