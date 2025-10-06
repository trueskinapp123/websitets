import React, { useState } from 'react';

interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Optimized Image component for Vite React (replaces Next.js Image)
const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    // Fallback to placeholder if image fails
    setImageSrc('/images/placeholder.jpg');
    onError?.();
  };

  // Ensure proper image path
  const getImageSrc = (imagePath: string) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/images/')) {
      return imagePath;
    }
    if (imagePath.startsWith('./images/')) {
      return imagePath.replace('./images/', '/images/');
    }
    if (!imagePath.includes('/')) {
      return `/images/${imagePath}`;
    }
    return imagePath;
  };

  const finalSrc = getImageSrc(imageSrc);
  const shouldShowBlur = placeholder === 'blur' && blurDataURL && !isLoaded;

  const imageStyle = fill ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  } : {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {/* Blur placeholder */}
      {shouldShowBlur && (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={imageStyle}
        />
      )}
      
      {/* Main image */}
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={imageStyle}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && !shouldShowBlur && (
        <div 
          className={`bg-gray-200 animate-pulse ${className}`}
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default NextImage;
