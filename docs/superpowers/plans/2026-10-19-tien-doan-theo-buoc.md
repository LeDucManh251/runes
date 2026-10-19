# Tab Tiên đoán theo từng bước (phần 2/2)

**Sub-skill bắt buộc để thực thi**: Subagent-Driven Development (khuyến nghị) hoặc Inline
Execution — người dùng chọn sau khi plan này được duyệt.

**Spec gốc**: `docs/superpowers/specs/2026-10-19-tien-doan-theo-buoc-design.md`

## Goal

Thay bố cục tab Tiên đoán bằng hai bước: (1) màn đặt câu hỏi tập trung với gợi ý và chọn kiểu trải
bài bằng hình minh họa; (2) màn đọc bài với dải câu hỏi dính đầu trang (xem đầy đủ / thu gọn, số lá
đã lật, "Hỏi câu khác" giữ câu cũ) và hàng lá bài.

## Architecture

```
src/
  data/
    spreads.ts                 (TẠO) — SPREADS, SpreadId, getSpread
    spreads.test.ts            (TẠO)
  components/
    divination/
      AskStep.tsx              (TẠO) — bước 1
      QuestionBar.tsx          (TẠO) — dải câu hỏi bước 2
    RandomPullTab.tsx          (VIẾT LẠI) — giữ state, chọn bước
    RandomPullTab.test.tsx     (TẠO)
  App.tsx                      (SỬA) — đo .top-band → --top-band-height
  setupTests.ts                (SỬA) — getContext trả null
  index.css                    (SỬA) — class bước 1, dải câu hỏi, hàng lá bài
```

## Tech Stack

React 18 + TypeScript, CSS custom properties (token "Đá cổ"), Vitest + RTL (`fireEvent`,
`vi.spyOn` getter trên `Element.prototype` để giả lập chữ bị cắt).

---

## Task 1 — `spreads.ts` (TDD)

1. Tạo `src/data/spreads.test.ts`:
   ```ts
   import { describe, expect, it } from 'vitest';
   import { SPREADS, getSpread } from './spreads';

   describe('SPREADS', () => {
     it('có 4 kiểu theo thứ tự 1 / 2 / 3 / 5 lá', () => {
       expect(SPREADS.map((spread) => spread.count)).toEqual([1, 2, 3, 5]);
     });

     it('mỗi kiểu có đúng số tên vị trí bằng số lá', () => {
       SPREADS.forEach((spread) => expect(spread.positions).toHaveLength(spread.count));
     });

     it('getSpread trả đúng kiểu theo id', () => {
       expect(getSpread('three').positions[1]).toBe('Tình huống hiện tại');
     });
   });
   ```
2. `npx vitest run src/data/spreads.test.ts` → **FAIL** (không có module).
3. Tạo `src/data/spreads.ts`:
   ```ts
   export type SpreadId = 'one' | 'two' | 'three' | 'five';

   export interface Spread {
     id: SpreadId;
     count: number;
     /** Mô tả ngắn hiện trên nút chọn kiểu trải bài. */
     label: string;
     /** Tên vị trí của từng lá, độ dài bằng `count`. */
     positions: string[];
   }

   export const SPREADS: Spread[] = [
     { id: 'one', count: 1, label: 'Thông điệp', positions: ['Thông điệp chính'] },
     { id: 'two', count: 2, label: 'Chú ý – Phản hồi', positions: ['Điều cần chú ý', 'Cách nên phản hồi'] },
     {
       id: 'three',
       count: 3,
       label: 'Quá khứ – Hiện tại – Tiếp theo',
       positions: ['Ảnh hưởng quá khứ', 'Tình huống hiện tại', 'Bước tiếp theo']
     },
     {
       id: 'five',
       count: 5,
       label: 'Toàn cảnh',
       positions: ['Gốc rễ vấn đề', 'Thử thách', 'Sự hỗ trợ ẩn', 'Hành động nên làm', 'Xu hướng sắp tới']
     }
   ];

   export const getSpread = (id: SpreadId): Spread => SPREADS.find((spread) => spread.id === id) ?? SPREADS[0];
   ```
4. Chạy lại → **PASS**. Commit: `Add spread definitions for divination layouts`

## Task 2 — Bỏ log lỗi canvas trong test

1. Thêm vào cuối `src/setupTests.ts`:
   ```ts

   // jsdom không có canvas: trả null để StarMist tự bỏ qua thay vì in lỗi "Not implemented".
   HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
   ```
2. `npm test 2>&1 | grep -c "Not implemented"` → `0`; toàn bộ test PASS.
3. Commit: `Silence jsdom canvas errors in tests`

## Task 3 — Bố cục hai bước (TDD)

1. Tạo `src/components/RandomPullTab.test.tsx`:
   ```tsx
   import { fireEvent, render, screen, within } from '@testing-library/react';
   import { afterEach, describe, expect, it, vi } from 'vitest';
   import RandomPullTab from './RandomPullTab';

   const questionInput = () => screen.queryByLabelText('Câu hỏi của bạn');
   const cardFronts = () => screen.queryAllByRole('button', { name: /Lật mở lá bài ẩn/ });
   const questionBar = () => screen.getByRole('region', { name: 'Câu hỏi của lượt rút' });

   const drawWith = (question: string, spreadName: RegExp) => {
     fireEvent.change(questionInput()!, { target: { value: question } });
     fireEvent.click(screen.getByRole('button', { name: spreadName }));
     fireEvent.click(screen.getByRole('button', { name: 'Tiên đoán' }));
   };

   describe('RandomPullTab', () => {
     afterEach(() => {
       vi.restoreAllMocks();
     });

     it('bước 1 có tiêu đề, 5 gợi ý, 4 kiểu trải bài và chưa có lá nào', () => {
       render(<RandomPullTab isMobile={false} />);
       expect(screen.getByRole('heading', { name: 'Điều gì đang ở trong tâm trí bạn?' })).toBeInTheDocument();
       expect(within(screen.getByRole('group', { name: 'Gợi ý câu hỏi' })).getAllByRole('button')).toHaveLength(5);
       expect(within(screen.getByRole('group', { name: 'Kiểu trải bài' })).getAllByRole('button')).toHaveLength(4);
       expect(cardFronts()).toHaveLength(0);
     });

     it('bấm gợi ý thì điền đúng chữ đó vào ô câu hỏi', () => {
       render(<RandomPullTab isMobile={false} />);
       fireEvent.click(screen.getByRole('button', { name: 'Một mối quan hệ' }));
       expect(questionInput()).toHaveValue('Một mối quan hệ');
     });

     it('rút 3 lá: thu thành dải câu hỏi và hiện 3 lá úp', () => {
       render(<RandomPullTab isMobile={false} />);
       drawWith('Công việc sắp tới', /^3 lá/);
       expect(questionInput()).not.toBeInTheDocument();
       expect(within(questionBar()).getByText('“Công việc sắp tới”')).toBeInTheDocument();
       expect(within(questionBar()).getByText('3 lá · đã lật 0/3')).toBeInTheDocument();
       expect(cardFronts()).toHaveLength(3);
     });

     it('lật một lá thì dải cập nhật số lá đã lật', () => {
       render(<RandomPullTab isMobile={false} />);
       drawWith('Công việc sắp tới', /^3 lá/);
       fireEvent.click(cardFronts()[0]);
       expect(within(questionBar()).getByText('3 lá · đã lật 1/3')).toBeInTheDocument();
     });

     it('câu hỏi trống thì dải ghi "Không đặt câu hỏi cụ thể"', () => {
       render(<RandomPullTab isMobile={false} />);
       drawWith('   ', /^1 lá/);
       expect(within(questionBar()).getByText('Không đặt câu hỏi cụ thể')).toBeInTheDocument();
     });

     it('"Hỏi câu khác" quay về bước 1, giữ câu hỏi và kiểu trải bài', () => {
       render(<RandomPullTab isMobile={false} />);
       drawWith('Chuyện tiền bạc', /^5 lá/);
       fireEvent.click(within(questionBar()).getByRole('button', { name: /Hỏi câu khác/ }));
       expect(questionInput()).toHaveValue('Chuyện tiền bạc');
       expect(screen.getByRole('button', { name: /^5 lá/ })).toHaveAttribute('aria-pressed', 'true');
       expect(cardFronts()).toHaveLength(0);
     });

     it('câu hỏi bị cắt thì có "Xem đầy đủ", bấm thành "Thu gọn"', () => {
       vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(800);
       vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(200);
       render(<RandomPullTab isMobile={false} />);
       drawWith('Một câu hỏi rất dài về công việc, gia đình và những dự định trong năm tới', /^1 lá/);
       const toggle = within(questionBar()).getByRole('button', { name: 'Xem đầy đủ' });
       expect(toggle).toHaveAttribute('aria-expanded', 'false');
       fireEvent.click(toggle);
       expect(within(questionBar()).getByRole('button', { name: 'Thu gọn' })).toHaveAttribute('aria-expanded', 'true');
     });

     it('câu hỏi không bị cắt thì không có nút "Xem đầy đủ"', () => {
       render(<RandomPullTab isMobile={false} />);
       drawWith('Ngắn', /^1 lá/);
       expect(within(questionBar()).queryByRole('button', { name: 'Xem đầy đủ' })).not.toBeInTheDocument();
     });
   });
   ```
2. `npx vitest run src/components/RandomPullTab.test.tsx` → **FAIL** (chưa có tiêu đề bước 1).
3. Tạo `src/components/divination/AskStep.tsx`:
   ```tsx
   import { useRef } from 'react';
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
           rows={2}
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
   ```
4. Tạo `src/components/divination/QuestionBar.tsx`:
   ```tsx
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
   ```
5. Viết lại `src/components/RandomPullTab.tsx`:
   ```tsx
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
   ```
6. Trong `src/index.css`:
   - Trong quy tắc `:focus-visible` chung (bắt đầu bằng `.btn:focus-visible,`), thêm 3 dòng
     `.chip:focus-visible,` `.spread-option:focus-visible,` `.question-bar-toggle:focus-visible,`
     ngay sau dòng `.btn:focus-visible,`.
   - Chèn khối sau ngay **trước** dòng `/* ============================================================` của
     mục "Màn hình hẹp":
   ```css
   /* ============================================================
      Tab Tiên đoán — bước 1 (đặt câu hỏi) và bước 2 (đọc bài)
      ============================================================ */
   .divination {
     position: relative;
     max-width: 1200px;
     margin: 0 auto;
   }

   .divination-content {
     position: relative;
     z-index: 1;
   }

   .ask-step {
     max-width: 720px;
     margin: 0 auto;
     padding: 2rem 0 1rem;
     text-align: center;
   }

   .ask-title {
     font-size: 2rem;
     color: var(--text);
     margin-bottom: 0.4rem;
   }

   .ask-subtitle {
     color: var(--text-muted);
     margin-bottom: 1.5rem;
   }

   .ask-input {
     display: block;
     width: 100%;
     max-width: 560px;
     margin: 0 auto;
     padding: 0.6rem 0.25rem;
     resize: none;
     font-family: var(--font-display);
     font-size: 1.4rem;
     font-style: italic;
     line-height: 1.4;
     text-align: center;
     color: var(--text);
     background: transparent;
     border: none;
     border-bottom: 1px solid var(--line-strong);
     outline: none;
     transition: border-color 0.2s ease;
   }

   .ask-input::placeholder {
     color: var(--text-muted);
   }

   .ask-input:focus {
     border-bottom-color: var(--accent);
   }

   .ask-chips {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 0.5rem;
     margin: 1.25rem 0 2rem;
   }

   .chip {
     min-height: 36px;
     padding: 0.35rem 0.9rem;
     font-family: var(--font-body);
     font-size: 0.85rem;
     color: var(--text-body);
     background: transparent;
     border: 1px solid var(--line);
     border-radius: 999px;
     cursor: pointer;
     transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
   }

   .chip:hover {
     color: var(--text);
     border-color: var(--line-strong);
     background: var(--accent-soft);
   }

   .spread-picker {
     display: grid;
     grid-template-columns: repeat(4, minmax(0, 1fr));
     gap: 0.75rem;
     max-width: 600px;
     margin: 0 auto 2rem;
   }

   .spread-option {
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 0.3rem;
     padding: 0.9rem 0.5rem 0.75rem;
     font-family: var(--font-body);
     color: var(--text-muted);
     background: transparent;
     border: 1px solid var(--line);
     border-radius: var(--radius);
     cursor: pointer;
     transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
   }

   .spread-option:hover {
     color: var(--text-body);
     border-color: var(--line-strong);
   }

   .spread-option.active {
     color: var(--text);
     background: var(--accent-soft);
     border-color: var(--accent);
   }

   .spread-mini {
     display: flex;
     align-items: center;
     gap: 4px;
     height: 26px;
     margin-bottom: 0.2rem;
   }

   .spread-mini i {
     display: block;
     width: 13px;
     height: 20px;
     border: 1px solid currentColor;
     border-radius: 2px;
   }

   .spread-option.active .spread-mini i {
     border-color: var(--accent);
     background: var(--accent-soft);
   }

   .spread-count {
     font-family: var(--font-display);
     font-weight: 700;
     font-size: 1.05rem;
   }

   .spread-label {
     font-size: 0.75rem;
     line-height: 1.3;
   }

   .ask-draw {
     padding-left: 3.5rem;
     padding-right: 3.5rem;
   }

   /* Dính ngay dưới thanh trên cùng; App ghi chiều cao thanh vào --top-band-height. */
   .question-bar {
     position: sticky;
     top: var(--top-band-height, 0px);
     z-index: 50;
     display: flex;
     align-items: center;
     flex-wrap: wrap;
     gap: 0.5rem 1.25rem;
     margin-bottom: 1.75rem;
     padding: 0.75rem 1.25rem;
     background: var(--band);
     backdrop-filter: blur(12px);
     border: 1px solid var(--line);
     border-radius: var(--radius);
   }

   .question-bar-main {
     flex: 1 1 260px;
     min-width: 0;
     display: flex;
     align-items: baseline;
     gap: 0.6rem;
   }

   .question-bar-text {
     min-width: 0;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     font-family: var(--font-display);
     font-size: 1.2rem;
     font-style: italic;
     font-weight: 600;
     color: var(--text);
   }

   .question-bar-text.is-expanded {
     overflow: visible;
     white-space: normal;
   }

   .question-bar-text.is-empty {
     font-weight: 400;
     color: var(--text-muted);
   }

   .question-bar-toggle {
     flex-shrink: 0;
     padding: 0;
     font-family: var(--font-body);
     font-size: 0.8rem;
     color: var(--accent);
     background: none;
     border: none;
     cursor: pointer;
     text-decoration: underline;
     text-underline-offset: 3px;
   }

   .question-bar-meta {
     font-size: 0.85rem;
     white-space: nowrap;
     color: var(--text-muted);
   }

   .btn.question-bar-again {
     min-height: 36px;
     padding: 0.35rem 1rem;
     font-size: 0.9rem;
     letter-spacing: 0.06em;
   }

   .reading-cards {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 0.75rem;
     padding-bottom: 1rem;
   }

   .reading-cards .flip-card-container {
     flex: 0 1 230px;
     min-width: 190px;
   }
   ```
   - Trong khối `@media (max-width: 768px)` cuối file, thêm:
   ```css
     .ask-title {
       font-size: 1.6rem;
     }

     .ask-input {
       font-size: 1.2rem;
     }

     .spread-picker {
       grid-template-columns: repeat(2, minmax(0, 1fr));
     }

     .question-bar {
       padding: 0.6rem 0.9rem;
       margin-bottom: 1.25rem;
     }

     .question-bar-main {
       flex-basis: 100%;
     }

     .reading-cards .flip-card-container {
       flex: 1 1 100%;
       max-width: 340px;
     }
   ```
7. `npx vitest run src/components/RandomPullTab.test.tsx` → **PASS** 8/8.
8. Commit: `Rebuild divination tab as ask step and reading step`

## Task 4 — Dải câu hỏi dính dưới thanh trên cùng

1. `App.tsx`: import thêm `useRef`; trong component thêm
   ```tsx
     const topBandRef = useRef<HTMLDivElement>(null);

     // Ghi chiều cao thanh trên cùng vào CSS để dải câu hỏi (sticky) dính ngay bên dưới,
     // kể cả khi menu xuống dòng hoặc chuyển sang mobile.
     useEffect(() => {
       const band = topBandRef.current;
       if (!band || typeof ResizeObserver === 'undefined') return;
       const observer = new ResizeObserver(() => {
         document.documentElement.style.setProperty('--top-band-height', `${Math.round(band.getBoundingClientRect().height)}px`);
       });
       observer.observe(band);
       return () => observer.disconnect();
     }, []);
   ```
   và đổi `<div className="top-band">` thành `<div className="top-band" ref={topBandRef}>`.
2. `npm test` → PASS.
3. Commit: `Pin the question bar just below the top band`

## Task 5 — Kiểm tra tổng thể

1. `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` → sạch.
2. `grep -n "style={" src/components/RandomPullTab.tsx src/components/divination/*.tsx` → không có.
3. Chạy app + Playwright: bước 1 và bước 2 (lật 1 lá) ở 1440px và 375px; rút 5 lá, cuộn 400px,
   đo `getBoundingClientRect().top` của `.question-bar` = chiều cao `.top-band`; overflow ngang = 0
   ở 375/1025/1280/1440px (bước 1 và bước 2); console không lỗi mới.
4. Xem ảnh chụp, sửa chỗ lệch (nếu có), commit riêng.
