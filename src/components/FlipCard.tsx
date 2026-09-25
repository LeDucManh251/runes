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
          <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.12, marginBottom: '1rem' }}>?</span>
          <h3 className="rune-name" style={{ fontSize: '1.4rem', opacity: 0.2, marginBottom: '0.5rem', fontFamily: 'Cormorant Garamond' }}>Ẩn tự</h3>
          <p style={{ fontSize: '0.85rem', color: '#718096', fontStyle: 'italic', fontFamily: 'Inter' }}>Chạm để lật mở</p>
        </div>

        {/* MẶT SAU: HIỆU ỨNG XOAY LẬT 3D CHỐNG TRÀN CHỮ */}
        <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
          <div style={{
            marginBottom: '0.35rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(136, 192, 208, 0.35)',
            borderRadius: '999px', color: '#d7ecfb', fontSize: '0.78rem', fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            {position}
          </div>
          <span
            className="rune-symbol"
            style={{
              fontSize: '2.8rem', marginBottom: '0.2rem', textShadow: '0 0 15px rgba(136,192,208,0.6)',
              display: 'inline-block', transform: isReversed ? 'rotate(180deg)' : 'none'
            }}
          >
            {rune.symbol}
          </span>
          <h3 className="rune-name" style={{ fontSize: '1.2rem', marginBottom: '0.15rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>
            {rune.name}{isReversed ? ' (Ngược)' : ''}
          </h3>
          <p className="rune-meaning" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: '#81a1c1' }}>
            <strong>{isReversed && rune.reversedMeaning ? rune.reversedMeaning : rune.meaning}</strong>
          </p>

          <RuneAnnotations rune={rune} />

          <div className="flip-card-scroll-zone">
            <p style={{ fontSize: '0.82rem', lineHeight: '1.45', color: '#cbd5e0', textAlign: 'justify', margin: '0 0 0.4rem 0', fontFamily: 'Inter, sans-serif' }}>
              {rune.description}
            </p>
            <p style={{
              fontSize: '0.85rem', lineHeight: '1.45', paddingTop: '0.4rem', borderTop: '1px solid rgba(232, 244, 253, 0.12)',
              color: '#d7ecfb', fontStyle: 'italic', textAlign: 'justify', fontFamily: 'Inter, sans-serif', margin: 0
            }}>
              {adviceText}
            </p>
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
