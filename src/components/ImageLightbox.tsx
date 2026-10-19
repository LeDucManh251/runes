interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

/** Modal phóng to ảnh — không render gì nếu `src` là null. Nút đóng tự nhận focus. */
function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  if (!src) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Ảnh phóng to" className="lightbox" onClick={onClose}>
      <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btn btn-ghost lightbox-close" onClick={onClose} aria-label="Đóng ảnh phóng to" autoFocus>
          ✕
        </button>
        <img src={src} alt="Ảnh phóng to" className="figure-img lightbox-img" />
      </div>
    </div>
  );
}

export default ImageLightbox;
