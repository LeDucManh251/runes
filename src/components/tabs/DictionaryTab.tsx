import { useState } from 'react';
import { runes } from '../../data/runes';
import RuneAnnotations from '../RuneAnnotations';

/** Tab "Từ điển Rune": tìm kiếm + lưới 24 rune. */
function DictionaryTab() {
  const [search, setSearch] = useState('');

  const filteredRunes = runes.filter(rune =>
    rune.name.toLowerCase().includes(search.toLowerCase()) ||
    rune.meaning.toLowerCase().includes(search.toLowerCase()) ||
    rune.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(145deg, #1a1d26, #0e1117)',
              border: '1px solid rgba(99, 179, 237, 0.3)', borderRadius: '8px', color: '#e8f4fd',
              fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <div className="rune-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {filteredRunes.map((rune, index) => (
          <div
            key={rune.id}
            className="dictionary-card weave-in"
            style={{ padding: '1.75rem', textAlign: 'center', animationDelay: `${Math.min(index, 10) * 0.05}s` }}
          >
            <span className="rune-symbol" style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>{rune.symbol}</span>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{rune.name}</h3>
            <p className="rune-meaning" style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem' }}>
              <strong>{rune.meaning}</strong>
            </p>
            {rune.reversedMeaning && (
              <p style={{ fontSize: '0.85rem', color: '#7a92a8', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
                Khi ngược: {rune.reversedMeaning}
              </p>
            )}
            <RuneAnnotations rune={rune} />
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', textAlign: 'justify', margin: '0', fontFamily: 'Inter, sans-serif' }}>{rune.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DictionaryTab;
