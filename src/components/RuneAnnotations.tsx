import { Rune } from '../data/runes';

interface RuneAnnotationsProps {
  rune: Rune;
}

/** Hiển thị các "tag" chú thích từ nguyên (word/translated/historyNote) của một rune, có tooltip khi hover. */
function RuneAnnotations({ rune }: RuneAnnotationsProps) {
  if (!rune.annotations || rune.annotations.length === 0) return null;

  return (
    <div className="rune-annotations">
      {rune.annotations.map((ann, idx) => (
        <span key={idx} className="tag rune-tooltip">
          {ann.word}
          <span className="tooltip-content">
            <strong className="tooltip-title">{ann.translated}</strong>
            <span className="tooltip-text">{ann.historyNote}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default RuneAnnotations;
