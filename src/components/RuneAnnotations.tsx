import { Rune } from '../data/runes';

interface RuneAnnotationsProps {
  rune: Rune;
}

/** Hiển thị các "tag" chú thích từ nguyên (word/translated/historyNote) của một rune, có tooltip khi hover. */
function RuneAnnotations({ rune }: RuneAnnotationsProps) {
  if (!rune.annotations || rune.annotations.length === 0) return null;

  return (
    <div style={{ marginBottom: '0.4rem', display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {rune.annotations.map((ann, idx) => (
        <span key={idx} className="rune-tooltip">
          {ann.word}
          <span className="tooltip-content">
            <strong style={{ color: '#88c0d0', display: 'block', marginBottom: '0.2rem', fontSize: '0.95rem', fontFamily: 'Cormorant Garamond, serif' }}>
              {ann.translated}
            </strong>
            <span style={{ fontSize: '0.85rem', lineHeight: '1.4', display: 'block', color: '#e5e9f0', fontFamily: 'Inter, sans-serif' }}>
              {ann.historyNote}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default RuneAnnotations;
