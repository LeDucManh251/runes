interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

/** Modal phóng to ảnh — không render gì nếu `src` là null. */
function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ảnh phóng to"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5, 7, 10, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', maxWidth: 'min(95vw, 1600px)', maxHeight: 'min(95vh, 1000px)' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Đóng ảnh phóng to"
          style={{
            position: 'absolute', top: '-2.5rem', right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '999px', color: '#e8f4fd', width: '2rem', height: '2rem', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1
          }}
        >
          ✕
        </button>
        <img src={src} alt="Ảnh phóng to" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.3)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)' }} />
      </div>
    </div>
  );
}

export default ImageLightbox;
