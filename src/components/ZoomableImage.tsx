import { KeyboardEvent } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  onOpen: (src: string) => void;
}

/** Ảnh minh họa bấm chuột hoặc Enter/Space để phóng to; tải lười để không chặn trang. */
function ZoomableImage({ src, alt, className = '', onOpen }: ZoomableImageProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(src);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`figure-img ${className}`.trim()}
      role="button"
      tabIndex={0}
      loading="lazy"
      decoding="async"
      onClick={() => onOpen(src)}
      onKeyDown={handleKeyDown}
    />
  );
}

export default ZoomableImage;
