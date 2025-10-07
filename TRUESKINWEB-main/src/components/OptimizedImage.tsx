import React from 'react';
import NextImage from './NextImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
  onError,
  width,
  height,
  fill = false,
  priority = false
}) => {
  // Ensure the image path is properly formatted
  const getImageSrc = (imagePath: string) => {
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with /images/, return as is (for local images)
    if (imagePath.startsWith('/images/')) {
      return imagePath;
    }
    
    // If it starts with ./images/, convert to /images/
    if (imagePath.startsWith('./images/')) {
      return imagePath.replace('./images/', '/images/');
    }
    
    // If it's just a filename, assume it's in /images/
    if (!imagePath.includes('/')) {
      return `/images/${imagePath}`;
    }
    
    // Default fallback
    return imagePath;
  };

  const finalSrc = getImageSrc(src);

  return (
    <NextImage
      src={finalSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      onError={onError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
};

export default OptimizedImage;
