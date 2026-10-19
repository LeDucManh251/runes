import { useLayoutEffect, useRef } from 'react';
import { SPREADS, SpreadId } from '../../data/spreads';

const QUESTION_SUGGESTIONS = [
  'Công việc sắp tới',
  'Một mối quan hệ',
  'Sức khỏe & tinh thần',
  'Chuyện tiền bạc',
  'Một quyết định đang cân nhắc'
];

interface AskStepProps {
  question: string;
  onQuestionChange: (question: string) => void;
  spreadId: SpreadId;
  onSpreadChange: (spreadId: SpreadId) => void;
  onDraw: () => void;
}

/** Bước 1 của tab Tiên đoán: đặt câu hỏi (có gợi ý), chọn kiểu trải bài, bấm rút. */
function AskStep({ question, onQuestionChange, spreadId, onSpreadChange, onDraw }: AskStepProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Ô câu hỏi tự cao theo nội dung: một dòng khi câu ngắn, xuống dòng khi câu dài.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    if (el.scrollHeight > 0) el.style.height = `${el.scrollHeight}px`;
  }, [question]);

  const pickSuggestion = (suggestion: string) => {
    onQuestionChange(suggestion);
    inputRef.current?.focus();
  };

  return (
    <section className="ask-step" aria-labelledby="ask-title">
      <h2 id="ask-title" className="ask-title">Điều gì đang ở trong tâm trí bạn?</h2>
      <p className="ask-subtitle">Viết ra câu hỏi, hoặc chọn một gợi ý.</p>

      <textarea
        ref={inputRef}
        className="ask-input"
        rows={1}
        maxLength={200}
        value={question}
        placeholder="Lời thỉnh cầu hoặc điều bạn đang băn khoăn…"
        aria-label="Câu hỏi của bạn"
        onChange={(e) => onQuestionChange(e.target.value)}
      />

      <div className="ask-chips" role="group" aria-label="Gợi ý câu hỏi">
        {QUESTION_SUGGESTIONS.map((suggestion) => (
          <button key={suggestion} type="button" className="chip" onClick={() => pickSuggestion(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      <div className="spread-picker" role="group" aria-label="Kiểu trải bài">
        {SPREADS.map((spread) => {
          const isActive = spread.id === spreadId;
          return (
            <button
              key={spread.id}
              type="button"
              className={`spread-option ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onSpreadChange(spread.id)}
            >
              <span className="spread-mini" aria-hidden="true">
                {Array.from({ length: spread.count }, (_, index) => <i key={index} />)}
              </span>
              <span className="spread-count">{spread.count} lá</span>
              <span className="spread-label">{spread.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" className="btn ask-draw" onClick={onDraw}>Tiên đoán</button>
    </section>
  );
}

export default AskStep;
