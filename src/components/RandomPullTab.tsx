import { useState } from 'react';
import { Rune, interpolateAdvice, pickRandomRunes, rollOrientation } from '../data/runes';
import FlipCard from './FlipCard';
import StarMist from './StarMist';

type RuneCount = 'one' | 'two' | 'three' | 'five';

interface DrawnRune {
  rune: Rune;
  isReversed: boolean;
}

const spreadPositions: Record<RuneCount, string[]> = {
  one: ['Thông điệp chính'],
  two: ['Điều cần chú ý', 'Cách nên phản hồi'],
  three: ['Ảnh hưởng quá khứ', 'Tình huống hiện tại', 'Bước tiếp theo'],
  five: ['Gốc rễ vấn đề', 'Thử thách', 'Sự hỗ trợ ẩn', 'Hành động nên làm', 'Xu hướng sắp tới']
};

const getRuneCountNumber = (count: RuneCount) => (
  count === 'one' ? 1 : count === 'two' ? 2 : count === 'three' ? 3 : 5
);

interface RandomPullTabProps {
  isMobile: boolean;
}

/** Tab "Tiên đoán": nhập câu hỏi, rút 1/2/3/5 lá rune (có thể ngược), lật từng lá để xem lời khuyên. */
function RandomPullTab({ isMobile }: RandomPullTabProps) {
  const [horizontalRuneCount, setHorizontalRuneCount] = useState<RuneCount>('one');
  const [horizontalPulledRunes, setHorizontalPulledRunes] = useState<DrawnRune[]>([]);
  const [revealedCardIndices, setRevealedCardIndices] = useState<number[]>([]);
  const [runeQuestion, setRuneQuestion] = useState('');

  const getMobileOrderedRunes = (draws: DrawnRune[], revealedIndices: number[]) => {
    const indexed = draws.map((draw, index) => ({ draw, index }));
    if (!isMobile || revealedIndices.length === 0) {
      return indexed;
    }

    return [...indexed].sort((a, b) => {
      const aRevealed = revealedIndices.includes(a.index);
      const bRevealed = revealedIndices.includes(b.index);

      if (aRevealed && !bRevealed) return -1;
      if (!aRevealed && bRevealed) return 1;
      if (aRevealed && bRevealed) {
        return revealedIndices.indexOf(b.index) - revealedIndices.indexOf(a.index);
      }
      return a.index - b.index;
    });
  };

  const pullHorizontalRunes = () => {
    const count = getRuneCountNumber(horizontalRuneCount);
    const drawnRunes = pickRandomRunes(count).map((rune) => ({ rune, isReversed: rollOrientation(rune) }));
    setHorizontalPulledRunes(drawnRunes);
    setRevealedCardIndices([]);
  };

  const toggleCardReveal = (index: number) => {
    if (!revealedCardIndices.includes(index)) {
      setRevealedCardIndices([...revealedCardIndices, index]);
    }
  };

  const resetHorizontalRunes = () => {
    setHorizontalPulledRunes([]);
    setRevealedCardIndices([]);
    setRuneQuestion('');
  };

  const selectRuneCount = (count: RuneCount) => {
    setHorizontalRuneCount(count);
    setHorizontalPulledRunes([]);
    setRevealedCardIndices([]);
  };

  const getQuestionContext = () => {
    const question = runeQuestion.trim();
    if (!question) {
      return {
        subject: 'tình huống của bạn',
        prompt: 'Tập trung trong tâm tưởng một câu hỏi trước khi xin lời khuyên'
      };
    }
    return {
      subject: question,
      prompt: `Cốt lõi câu hỏi: "${question}"`
    };
  };

  const getAdviceText = (draw: DrawnRune, index: number) => {
    const positions = spreadPositions[horizontalRuneCount];
    const position = positions[index] || `Rune ${index + 1}`;
    const { subject } = getQuestionContext();
    return `${position}: ${interpolateAdvice(draw.rune, subject, draw.isReversed)}`;
  };

  return (
    <div style={{ maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', position: 'relative' }}>
      <StarMist />
      <div style={{ position: 'relative', zIndex: 1 }}>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1150px',
        margin: '0 auto 0.75rem auto',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* CỘT BÊN TRÁI: Lựa chọn 1 Rune và 2 Runes xếp chồng dọc */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '0.6rem',
          minWidth: isMobile ? '100%' : '120px',
          justifyContent: 'center'
        }}>
          {(['one', 'two'] as const).map((count) => (
            <button
              key={count}
              onClick={() => selectRuneCount(count)}
              style={{
                background: horizontalRuneCount === count ? 'var(--accent-soft)' : 'var(--surface)',
                color: 'var(--text)', border: horizontalRuneCount === count ? '1px solid var(--accent)' : '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                width: isMobile ? 'auto' : '100%', flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {count === 'one' ? '1 Rune' : '2 Runes'}
            </button>
          ))}
        </div>

        {/* KHỐI TRUNG TÂM: Ô nhập câu hỏi + Nút Tiên đoán */}
        <div style={{
          flex: 2, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '0.75rem 1.5rem',
          boxShadow: 'var(--shadow)', width: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem'
        }}>
          <label htmlFor="rune-question" style={{ display: 'block', width: '100%', textAlign: 'center', color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Xin lời khuyên từ các cổ tự Rune
          </label>
          <textarea
            id="rune-question"
            value={runeQuestion}
            onChange={(e) => setRuneQuestion(e.target.value)}
            placeholder="Lời thỉnh cầu hoặc vấn đề thầm kín mà bạn muốn xin chỉ dẫn..."
            rows={2}
            className="input"
            style={{ resize: 'none', minHeight: '52px', fontSize: '0.95rem', lineHeight: 1.4 }}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Inter, sans-serif', margin: '0.15rem 0' }}>
            {getQuestionContext().prompt}
          </p>

          {horizontalPulledRunes.length === 0 ? (
            <button className="btn" style={{ marginTop: '0.2rem' }} onClick={pullHorizontalRunes}>
              Tiên đoán
            </button>
          ) : (
            <button
              className="btn btn-ghost"
              style={{ marginTop: '0.2rem' }}
              onClick={resetHorizontalRunes}
            >
              Bắt đầu lại
            </button>
          )}
        </div>

        {/* CỘT BÊN PHẢI: Lựa chọn 3 Runes và 5 Runes xếp chồng dọc */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '0.6rem',
          minWidth: isMobile ? '100%' : '120px',
          justifyContent: 'center'
        }}>
          {(['three', 'five'] as const).map((count) => (
            <button
              key={count}
              onClick={() => selectRuneCount(count)}
              style={{
                background: horizontalRuneCount === count ? 'var(--accent-soft)' : 'var(--surface)',
                color: 'var(--text)', border: horizontalRuneCount === count ? '1px solid var(--accent)' : '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                width: isMobile ? 'auto' : '100%', flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {count === 'three' ? '3 Runes' : '5 Runes'}
            </button>
          ))}
        </div>

      </div>

      {/* HÀNG BÀI TIÊN ĐOÁN */}
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        gap: '0.75rem', marginTop: '0.5rem', marginBottom: '0.5rem', width: '100%',
        flexWrap: isMobile ? 'wrap' : 'nowrap', overflowX: 'auto', padding: '0.25rem'
      }}>
        {getMobileOrderedRunes(horizontalPulledRunes, revealedCardIndices).map(({ draw, index }) => {
          const positions = spreadPositions[horizontalRuneCount];
          const position = positions[index] || `Rune ${index + 1}`;
          return (
            <FlipCard
              key={index}
              rune={draw.rune}
              isReversed={draw.isReversed}
              position={position}
              adviceText={getAdviceText(draw, index)}
              isRevealed={revealedCardIndices.includes(index)}
              onReveal={() => toggleCardReveal(index)}
            />
          );
        })}
      </div>
      </div>
    </div>
  );
}

export default RandomPullTab;
