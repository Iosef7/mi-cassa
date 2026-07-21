'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { DriveImagePreview } from '@/components/DriveImagePreview';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Sin imágenes</span>
      </div>
    );
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderImage = (url: string, index: number, isMain: boolean = false) => {
    // If it's a Drive URL, use DriveImagePreview, else use regular Image
    if (url.includes('drive.google.com')) {
      return (
        <DriveImagePreview 
          url={url} 
          alt={`${title} - Imagen ${index + 1}`} 
          className="w-full h-full object-cover" 
          priority={isMain} 
        />
      );
    }
    
    return (
      <Image
        src={url}
        alt={`${title} - Imagen ${index + 1}`}
        fill
        className="object-cover"
        priority={isMain}
      />
    );
  };

  return (
    <>
      {/* Desktop / Tablet Bento Grid view (optional, but let's do a simple hero + thumbnails for premium feel) */}
      <div className="relative w-full group cursor-pointer" onClick={() => setIsFullscreen(true)}>
        <div className="aspect-[4/3] md:aspect-[21/9] relative overflow-hidden bg-gray-100">
          {renderImage(images[currentIndex], currentIndex, true)}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="text-white flex items-center gap-2 text-sm font-medium">
              <Expand size={16} /> Ver galería ({images.length} fotos)
            </span>
          </div>
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 md:opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 md:opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white absolute top-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent">
            <span className="text-sm font-medium">{currentIndex + 1} / {images.length}</span>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 max-w-7xl mx-auto flex items-center justify-center p-4">
               {renderImage(images[currentIndex], currentIndex, false)}
            </div>
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronLeft size={36} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}
          </div>
          
          <div className="h-24 bg-black flex items-center justify-center gap-2 overflow-x-auto px-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 w-24 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${
                  idx === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {renderImage(img, idx)}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
