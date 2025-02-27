// SourceImage.client.tsx
"use client";

import Image from "next/image";

export const SourceImage = ({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) => {
  // Trim any trailing spaces or control characters from the image URL
  const trimmedImageUrl = imageUrl?.trimEnd();

  return (
    <div className="relative w-48 h-48 shrink-0">
      <div className="rounded-full overflow-hidden border-4 border-white shadow-xl">
        {trimmedImageUrl ? (
          <Image
            src={trimmedImageUrl}
            alt={`Logo de ${name}`}
            width={200}
            height={200}
            className="w-full h-full object-cover"
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