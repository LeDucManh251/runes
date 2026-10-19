import { useState } from 'react';
import { runes } from '../../data/runes';
import RuneAnnotations from '../RuneAnnotations';

/** Tab "Từ điển Rune": tìm kiếm + lưới 24 rune. */
function DictionaryTab() {
  const [search, setSearch] = useState('');
  const query = search.toLowerCase();

  const filteredRunes = runes.filter((rune) =>
    rune.name.toLowerCase().includes(query) ||
    rune.meaning.toLowerCase().includes(query) ||
    rune.description.toLowerCase().includes(query)
  );

  return (
    <div>
      <div className="search-wrap">
        <input
          type="text"
          className="input"
          placeholder="Tìm kiếm..."
          aria-label="Tìm rune"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rune-grid">
        {filteredRunes.map((rune, index) => (
          <div
            key={rune.id}
            className="dictionary-card weave-in"
            style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
          >
            <span className="rune-symbol">{rune.symbol}</span>
            <h3 className="rune-name">{rune.name}</h3>
            <p className="rune-meaning">{rune.meaning}</p>
            {rune.reversedMeaning && <p className="rune-reversed">Khi ngược: {rune.reversedMeaning}</p>}
            <RuneAnnotations rune={rune} />
            <p className="rune-description">{rune.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DictionaryTab;
