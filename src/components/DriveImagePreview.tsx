"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const getDisplayUrl = (url: string, driveThumbnails?: Record<string, string>) => {
  if (driveThumbnails && driveThumbnails[url]) return driveThumbnails[url];
  if (url && typeof url === 'string' && url.includes('drive.google.com') && (url.includes('/preview') || url.includes('/view'))) {
    const fileId = url.match(/\/d\/(.+?)\/(?:preview|view)/)?.[1];
    if (fileId) {
      // Usar nuestro proxy backend seguro para eludir bloqueos de cookies de terceros
      return `/api/drive/image/${fileId}`;
    }
  }
  return url;
};

export const DriveImagePreview = ({ url, thumbnails, alt, className, priority, onClick }: { url: string, thumbnails?: Record<string, string>, alt: string, className?: string, priority?: boolean, onClick?: React.MouseEventHandler<HTMLImageElement | HTMLDivElement> }) => {
  const displayUrl = getDisplayUrl(url, thumbnails);
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/20 text-muted-foreground border-border border-dashed border ${className}`} onClick={onClick}>
         <div className="text-xs mb-1 font-medium">Permiso requerido</div>
         <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline z-10 pointer-events-auto">
            Abrir en Drive
         </a>
      </div>
    );
  }

  const isAllowedDomain = displayUrl?.includes('lh3.googleusercontent.com') || 
                          displayUrl?.includes('images.unsplash.com') ||
                          displayUrl?.includes('drive.google.com') ||
                          displayUrl?.startsWith('/');

  if (isAllowedDomain) {
    return <Image src={displayUrl} alt={alt} fill className={className} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" onError={() => setImgError(true)} priority={priority} onClick={onClick as any} />;
  }

  return <img src={displayUrl} alt={alt} className={className} loading={priority ? "eager" : "lazy"} onError={() => setImgError(true)} onClick={onClick as any} />;
};
