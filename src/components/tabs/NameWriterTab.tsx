import { useEffect, useState } from 'react';
import { getRuneById } from '../../data/runes';
import { RUNE_SEPARATOR, WritingMode, toRuneString, transliterate } from '../../data/transliterate';

interface ModeOption {
  id: WritingMode;
  label: string;
  hint: string;
}

const MODES: ModeOption[] = [
  { id: 'vi', label: 'Tiếng Việt', hint: 'Phiên theo cách đọc tiếng Việt, dấu thanh sẽ mất.' },
  { id: 'en', label: 'English', hint: 'Phiên theo cách đọc tiếng Anh, vd "th" thành ᚦ.' },
  { id: 'letters', label: 'Theo chữ cái', hint: 'Mỗi chữ cái Latin đổi thành một rune, không xét cách đọc.' }
];

type CopyStatus = 'idle' | 'copied' | 'failed';

/** Tab "Viết tên": gõ tên, chọn cách viết, xem và sao chép tên viết bằng rune. */
function NameWriterTab() {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<WritingMode>('vi');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const tokens = transliterate(name, mode);
  const runeString = toRuneString(tokens);
  const skipped = [...new Set(tokens.flatMap((token) => (token.kind === 'skipped' ? [token.source] : [])))];
  const selected = selectedIndex === null ? undefined : tokens[selectedIndex];
  const selectedRune = selected?.kind === 'rune' ? getRuneById(selected.runeId) : undefined;
  const activeMode = MODES.find((option) => option.id === mode) ?? MODES[0];

  useEffect(() => {
    if (copyStatus !== 'copied') return;
    const timer = window.setTimeout(() => setCopyStatus('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const handleNameChange = (value: string) => {
    setName(value);
    setSelectedIndex(null);
    setCopyStatus('idle');
  };

  const handleModeChange = (nextMode: WritingMode) => {
    setMode(nextMode);
    setSelectedIndex(null);
    setCopyStatus('idle');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(runeString);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <div className="rune-card name-writer">
      <h2 className="name-writer-title">Viết tên bằng Rune</h2>
      <p className="name-writer-intro">
        Rune là bảng chữ cái cổ của người Bắc Âu. Gõ tên bạn để xem nó được khắc bằng rune.
      </p>

      <input
        type="text"
        className="name-writer-input"
        value={name}
        maxLength={60}
        placeholder="Nhập tên của bạn…"
        aria-label="Tên cần viết bằng rune"
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <div className="name-writer-modes" role="group" aria-label="Cách viết">
        {MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`name-writer-mode ${mode === option.id ? 'active' : ''}`}
            aria-pressed={mode === option.id}
            onClick={() => handleModeChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="name-writer-hint">{activeMode.hint}</p>

      {tokens.length === 0 ? (
        <p className="name-writer-empty">Ví dụ: Minh Anh</p>
      ) : (
        <>
          <p className="name-writer-output">
            {tokens.map((token, index) => {
              if (token.kind === 'separator') {
                return <span key={index} className="name-writer-separator" aria-hidden="true">{RUNE_SEPARATOR}</span>;
              }
              if (token.kind === 'skipped') return null;
              const rune = getRuneById(token.runeId);
              if (!rune) return null;
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  className={`name-writer-rune ${isSelected ? 'active' : ''}`}
                  aria-label={`${rune.name}, từ "${token.source}"`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(isSelected ? null : index)}
                >
                  {rune.symbol}
                </button>
              );
            })}
          </p>

          {selected?.kind === 'rune' && selectedRune && (
            <div className="name-writer-detail">
              <span className="name-writer-detail-symbol" aria-hidden="true">{selectedRune.symbol}</span>
              <div>
                <h3>{selectedRune.name}</h3>
                <p>{selectedRune.meaning}</p>
                <p className="name-writer-detail-source">Phiên từ: {selected.source}</p>
              </div>
            </div>
          )}

          {skipped.length > 0 && (
            <p className="name-writer-skipped">Không có rune tương ứng, đã bỏ qua: {skipped.join(', ')}</p>
          )}

          <button type="button" className="name-writer-copy" onClick={handleCopy} disabled={runeString === ''}>
            {copyStatus === 'copied' ? 'Đã sao chép' : 'Sao chép'}
          </button>
          {copyStatus === 'failed' && (
            <p className="name-writer-copy-error" role="alert">Không sao chép được, hãy bôi đen để chép thủ công.</p>
          )}
        </>
      )}

      <p className="name-writer-note">
        Đây là phiên âm gần đúng: rune ghi âm của tiếng Germanic cổ, tiếng Việt sẽ mất dấu thanh.
        Nếu bạn định xăm hoặc khắc, hãy tham khảo thêm.
      </p>
    </div>
  );
}

export default NameWriterTab;
