'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.6 }}></div>
      </div>
      <p className="ml-4 text-lg font-medium text-blue-300">Cargando...</p>
    </div>
  );
}
