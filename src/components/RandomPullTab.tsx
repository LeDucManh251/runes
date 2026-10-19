import { useState } from 'react';
import { Rune, interpolateAdvice, pickRandomRunes, rollOrientation } from '../data/runes';
import { SpreadId, getSpread } from '../data/spreads';
import AskStep from './divination/AskStep';
import QuestionBar from './divination/QuestionBar';
import FlipCard from './FlipCard';
import StarMist from './StarMist';

interface DrawnRune {
  rune: Rune;
  isReversed: boolean;
}

interface RandomPullTabProps {
  isMobile: boolean;
}

const DEFAULT_SUBJECT = 'tình huống của bạn';

/** Tab "Tiên đoán" hai bước: đặt câu hỏi + chọn kiểu trải bài → rút và lật từng lá. */
function RandomPullTab({ isMobile }: RandomPullTabProps) {
  const [spreadId, setSpreadId] = useState<SpreadId>('one');
  const [question, setQuestion] = useState('');
  const [draws, setDraws] = useState<DrawnRune[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const spread = getSpread(spreadId);
  const subject = question.trim() || DEFAULT_SUBJECT;

  const drawRunes = () => {
    setDraws(pickRandomRunes(spread.count).map((rune) => ({ rune, isReversed: rollOrientation(rune) })));
    setRevealedIndices([]);
  };

  const askAgain = () => {
    setDraws([]);
    setRevealedIndices([]);
  };

  const reveal = (index: number) => {
    setRevealedIndices((current) => (current.includes(index) ? current : [...current, index]));
  };

  // Trên mobile, lá vừa lật nổi lên đầu (mới nhất trước) để không phải cuộn đi tìm.
  const indexedDraws = draws.map((drawn, index) => ({ drawn, index }));
  const orderedDraws = !isMobile || revealedIndices.length === 0
    ? indexedDraws
    : [...indexedDraws].sort((a, b) => {
        const aRevealed = revealedIndices.indexOf(a.index);
        const bRevealed = revealedIndices.indexOf(b.index);
        if (aRevealed !== -1 && bRevealed !== -1) return bRevealed - aRevealed;
        if (aRevealed !== -1) return -1;
        if (bRevealed !== -1) return 1;
        return a.index - b.index;
      });

  return (
    <div className="divination">
      <StarMist />
      <div className="divination-content">
        {draws.length === 0 ? (
          <AskStep
            question={question}
            onQuestionChange={setQuestion}
            spreadId={spreadId}
            onSpreadChange={setSpreadId}
            onDraw={drawRunes}
          />
        ) : (
          <>
            <QuestionBar question={question} spread={spread} revealedCount={revealedIndices.length} onAskAgain={askAgain} />
            <div className="reading-cards">
              {orderedDraws.map(({ drawn, index }) => {
                const position = spread.positions[index] ?? `Rune ${index + 1}`;
                return (
                  <FlipCard
                    key={index}
                    rune={drawn.rune}
                    isReversed={drawn.isReversed}
                    position={position}
                    adviceText={`${position}: ${interpolateAdvice(drawn.rune, subject, drawn.isReversed)}`}
                    isRevealed={revealedIndices.includes(index)}
                    onReveal={() => reveal(index)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RandomPullTab;
