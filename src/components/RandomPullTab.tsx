import { useState } from 'react';
import { Rune, interpolateAdvice, pickRandomRunes } from '../data/runes';
import FlipCard from './FlipCard';
import StarMist from './StarMist';

type RuneCount = 'one' | 'two' | 'three' | 'five';

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

/** Tab "Tiên đoán": nhập câu hỏi, rút 1/2/3/5 lá rune, lật từng lá để xem lời khuyên. */
function RandomPullTab({ isMobile }: RandomPullTabProps) {
  const [horizontalRuneCount, setHorizontalRuneCount] = useState<RuneCount>('one');
  const [horizontalPulledRunes, setHorizontalPulledRunes] = useState<Rune[]>([]);
  const [revealedCardIndices, setRevealedCardIndices] = useState<number[]>([]);
  const [runeQuestion, setRuneQuestion] = useState('');

  const getMobileOrderedRunes = (runesList: Rune[], revealedIndices: number[]) => {
    const indexed = runesList.map((rune, index) => ({ rune, index }));
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
    setHorizontalPulledRunes(pickRandomRunes(count));
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

  const getAdviceText = (rune: Rune, index: number) => {
    const positions = spreadPositions[horizontalRuneCount];
    const position = positions[index] || `Rune ${index + 1}`;
    const { subject } = getQuestionContext();
    return `${position}: ${interpolateAdvice(rune, subject)}`;
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
                background: horizontalRuneCount === count ? 'linear-gradient(145deg, #2c3e50, #1a252f)' : 'linear-gradient(145deg, #1a1d24, #0e1117)',
                color: '#e8f4fd', border: horizontalRuneCount === count ? '1px solid #63b3ed' : '1px solid rgba(99, 179, 237, 0.2)',
                borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                width: isMobile ? 'auto' : '100%', flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {count === 'one' ? '1 Rune' : '2 Runes'}
            </button>
          ))}
        </div>

        {/* KHỐI TRUNG TÂM: Ô nhập câu hỏi + Nút Tiên đoán */}
        <div style={{
          flex: 2, background: 'linear-gradient(145deg, #181c24, #0a0d12)',
          border: '1px solid rgba(99, 179, 237, 0.15)', borderRadius: '12px', padding: '0.75rem 1.5rem',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)', width: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem'
        }}>
          <label htmlFor="rune-question" style={{ display: 'block', width: '100%', textAlign: 'center', color: '#e8f4fd', fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Xin lời khuyên từ các cổ tự Rune
          </label>
          <textarea
            id="rune-question"
            value={runeQuestion}
            onChange={(e) => setRuneQuestion(e.target.value)}
            placeholder="Lời thỉnh cầu hoặc vấn đề thầm kín mà bạn muốn xin chỉ dẫn..."
            rows={2}
            style={{
              width: '100%', resize: 'none', minHeight: '52px', padding: '0.5rem 0.8rem',
              background: 'linear-gradient(145deg, #12151c, #0a0c10)', border: '1px solid rgba(99, 179, 237, 0.2)',
              borderRadius: '8px', color: '#e8f4fd', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <p style={{ color: '#b8d4e6', fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Inter, sans-serif', margin: '0.15rem 0' }}>
            {getQuestionContext().prompt}
          </p>

          {horizontalPulledRunes.length === 0 ? (
            <button className="pull-button" style={{ background: 'linear-gradient(145deg, #3182ce, #2b6cb0)', fontSize: '1.05rem', height: '40px', padding: '0 2.5rem', borderRadius: '8px', color: '#fff', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem' }} onClick={pullHorizontalRunes}>
              Tiên đoán
            </button>
          ) : (
            <button
              className="pull-button"
              style={{ background: 'linear-gradient(145deg, #2d3748, #1a202c)', border: '1px solid rgba(99, 179, 237, 0.4)', fontSize: '1.05rem', height: '40px', padding: '0 2.5rem', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem' }}
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
                background: horizontalRuneCount === count ? 'linear-gradient(145deg, #2c3e50, #1a252f)' : 'linear-gradient(145deg, #1a1d24, #0e1117)',
                color: '#e8f4fd', border: horizontalRuneCount === count ? '1px solid #63b3ed' : '1px solid rgba(99, 179, 237, 0.2)',
                borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
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
        {getMobileOrderedRunes(horizontalPulledRunes, revealedCardIndices).map(({ rune, index }) => {
          const positions = spreadPositions[horizontalRuneCount];
          const position = positions[index] || `Rune ${index + 1}`;
          return (
            <FlipCard
              key={index}
              rune={rune}
              position={position}
              adviceText={getAdviceText(rune, index)}
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
