// SourceImage.client.tsx
"use client";

import Image from "next/image";

export const SourceImage = ({
  imageUrl,
  name,
  size = "default", // Añadimos un prop para controlar el tamaño
}: {
  imageUrl?: string;
  name: string;
  size?: "default" | "large" | "xlarge";
}) => {
  // Trim any trailing spaces or control characters from the image URL
  const trimmedImageUrl = imageUrl?.trimEnd();
  
  // Determinar las clases de tamaño basadas en el prop size
  const sizeClasses = {
    default: "w-full h-full",
    large: "w-56 h-56", // 224px x 224px
    xlarge: "w-64 h-64", // 256px x 256px
  };
  
  const containerClass = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`relative shrink-0 ${containerClass}`}>
      <div className="rounded-full overflow-hidden border-4 border-white shadow-xl w-full h-full">
        {trimmedImageUrl ? (
          <Image
            src={trimmedImageUrl}
            alt={`Logo de ${name}`}
            fill
            className="object-cover"
            sizes={size === "xlarge" ? "256px" : size === "large" ? "224px" : "(max-width: 768px) 200px, 256px"}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/default_periodico.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};