import { useLayoutEffect, useRef, useState } from 'react';
import { Spread } from '../../data/spreads';

interface QuestionBarProps {
  question: string;
  spread: Spread;
  revealedCount: number;
  onAskAgain: () => void;
}

/** Dải mỏng dính đầu trang ở bước đọc bài: câu hỏi (xem đầy đủ khi bị cắt), số lá đã lật, hỏi lại. */
function QuestionBar({ question, spread, revealedCount, onAskAgain }: QuestionBarProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const trimmed = question.trim();

  // Chỉ hiện "Xem đầy đủ" khi chữ thật sự bị cắt ở bề rộng hiện tại.
  useLayoutEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el || isExpanded) return;
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [trimmed, isExpanded]);

  return (
    <div className="question-bar" role="region" aria-label="Câu hỏi của lượt rút">
      <div className="question-bar-main">
        <p
          ref={textRef}
          className={`question-bar-text ${isExpanded ? 'is-expanded' : ''} ${trimmed ? '' : 'is-empty'}`}
        >
          {trimmed ? `“${trimmed}”` : 'Không đặt câu hỏi cụ thể'}
        </p>
        {(isTruncated || isExpanded) && (
          <button
            type="button"
            className="question-bar-toggle"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Thu gọn' : 'Xem đầy đủ'}
          </button>
        )}
      </div>
      <p className="question-bar-meta">{spread.count} lá · đã lật {revealedCount}/{spread.count}</p>
      <button type="button" className="btn btn-ghost question-bar-again" onClick={onAskAgain}>↺ Hỏi câu khác</button>
    </div>
  );
}

export default QuestionBar;
