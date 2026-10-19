import { KeyboardEvent } from 'react';
import { Rune } from '../data/runes';
import RuneAnnotations from './RuneAnnotations';

interface FlipCardProps {
  rune: Rune;
  isReversed: boolean;
  position: string;
  adviceText: string;
  isRevealed: boolean;
  onReveal: () => void;
}

/** Một lá bài rune có thể lật (3D flip) — mặt trước ẩn danh, mặt sau hiện ký hiệu (xoay nếu ngược) + lời khuyên. */
function FlipCard({ rune, isReversed, position, adviceText, isRevealed, onReveal }: FlipCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onReveal();
    }
  };

  return (
    <div className={`flip-card-container ${isRevealed ? 'is-revealed' : ''}`}>
      <div className="flip-card-inner">

        {/* MẶT TRƯỚC: TRẠNG THÁI ẨN, CLICK/ENTER/SPACE ĐỂ LẬT MỞ */}
        <div
          className="flip-card-front"
          role="button"
          tabIndex={isRevealed ? -1 : 0}
          aria-label={`Lật mở lá bài ẩn ở vị trí ${position}`}
          aria-pressed={isRevealed}
          onClick={() => !isRevealed && onReveal()}
          onKeyDown={handleKeyDown}
        >
          <span className="flip-card-mark" aria-hidden="true">?</span>
          <h3 className="flip-card-veil">Ẩn tự</h3>
          <p className="flip-card-hint">Chạm để lật mở</p>
        </div>

        {/* MẶT SAU: ký hiệu (xoay 180° nếu ngược), ý nghĩa, mô tả và lời khuyên cuộn được */}
        <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
          <div className="flip-card-position">{position}</div>
          <span className="rune-symbol" style={isReversed ? { transform: 'rotate(180deg)' } : undefined}>
            {rune.symbol}
          </span>
          <h3 className="rune-name">{rune.name}{isReversed ? ' (Ngược)' : ''}</h3>
          <p className="rune-meaning">{isReversed && rune.reversedMeaning ? rune.reversedMeaning : rune.meaning}</p>

          <RuneAnnotations rune={rune} />

          <div className="flip-card-scroll-zone">
            <p className="flip-card-description">{rune.description}</p>
            <p className="flip-card-advice">{adviceText}</p>
          </div>
        </div>

      </div>

      {isRevealed && (
        <div className="resonance" aria-hidden="true">
          <span className="resonance-ring" />
          <span className="resonance-ring resonance-ring--delay-1" />
          <span className="resonance-ring resonance-ring--delay-2" />
        </div>
      )}
    </div>
  );
}

export default FlipCard;
