# Nâng cấp nền tảng, tái cấu trúc App.tsx, và hiệu ứng động

**Sub-skill bắt buộc để thực thi**: Subagent-Driven Development (khuyến nghị) hoặc Inline
Execution — người dùng chọn sau khi plan này được duyệt.

**Spec gốc**: `docs/superpowers/specs/2026-09-18-upgrade-and-refactor-design.md`

## Goal

Dọn dependency thừa, nâng Vite lên v6, thêm ESLint + Vitest, tách `App.tsx` (274 dòng, 5 tab
gộp chung) thành các component theo trách nhiệm rõ ràng, và thêm 3 hiệu ứng động (Dệt Mở, Cộng
Hưởng, Sương Sao) — toàn bộ không đổi hành vi/nội dung hiện có của site đang chạy live trên
GitHub Pages (`base: '/runes/'`).

**Lưu ý so với spec gốc**: kiểm tra `git ls-files` cho thấy `dist/` và `.DS_Store` **không**
nằm trong git tracking (đã đúng từ trước) — bỏ bước "gỡ khỏi git" khỏi Phần 1 của spec, không
cần làm.

## Architecture

```
src/
  types.ts                      (MỚI) — TabId dùng chung giữa App và Nav
  App.tsx                       (SỬA) — chỉ còn state + render Nav/tab/lightbox
  components/
    Nav.tsx                     (MỚI) — nav desktop + mobile gộp làm 1
    ImageLightbox.tsx           (MỚI) — modal phóng to ảnh
    StarMist.tsx                (MỚI) — canvas particle nền, chỉ dùng trong RandomPullTab
    RandomPullTab.tsx           (SỬA) — bọc thêm StarMist, dùng pickRandomRunes
    FlipCard.tsx                (SỬA) — thêm hiệu ứng Cộng Hưởng khi lộ kết quả
    RuneAnnotations.tsx         (không đổi)
    tabs/
      DictionaryTab.tsx         (MỚI) — cắt từ App.tsx, thêm stagger Dệt Mở
      BindrunesTab.tsx          (MỚI) — cắt từ App.tsx
      WyrdTab.tsx                (MỚI) — cắt từ App.tsx
      HistoryTab.tsx            (MỚI) — cắt từ App.tsx
  data/
    runes.ts                    (SỬA) — thêm pickRandomRunes()
  index.css                     (SỬA) — thêm keyframes weave-in, resonance-pulse
  setupTests.ts                 (MỚI) — jest-dom matchers cho Vitest
  App.test.tsx                  (MỚI) — smoke test render App
  data/runes.test.ts            (MỚI) — test interpolateAdvice + pickRandomRunes
eslint.config.js                (MỚI)
vite.config.ts                  (SỬA) — thêm block `test` cho Vitest
package.json                   (SỬA) — bớt/thêm dependency, thêm script lint/test
```

## Tech Stack

React 18, TypeScript 5, Vite 6, Vitest 2 + @testing-library/react 16, ESLint 9 (flat config)
+ typescript-eslint 8 + eslint-plugin-react-hooks.

---

## Task 1 — Xóa dependency không dùng

**Modify**: `d:\runes-main\package.json`

1. Mở `package.json`, xóa dòng `"lucide-react": "^0.263.1",` khỏi `dependencies` và dòng
   `"vite-plugin-gh-pages": "^1.0.1",` khỏi `devDependencies` (đã xác nhận không import ở đâu
   trong `src/` bằng `grep -r "lucide-react\|vite-plugin-gh-pages" src`).
2. Chạy: `npm install`
   Kỳ vọng: cài đặt lại xong không lỗi, `node_modules/lucide-react` và
   `node_modules/vite-plugin-gh-pages` không còn tồn tại.
3. Chạy: `npm run build`
   Kỳ vọng: build thành công, không có cảnh báo thiếu module.
4. Commit: `git add package.json package-lock.json && git commit -m "Remove unused lucide-react and vite-plugin-gh-pages dependencies"`

## Task 2 — Nâng cấp Vite lên v6

**Modify**: `d:\runes-main\package.json`

1. Sửa trong `devDependencies`:
   - `"vite": "^4.4.5"` → `"vite": "^6.0.0"`
   - `"@vitejs/plugin-react": "^4.0.3"` → `"@vitejs/plugin-react": "^4.3.4"`
2. Chạy: `npm install`
   Kỳ vọng: không lỗi peer dependency (Node hiện tại là v22, thỏa yêu cầu Node ≥18.19 của Vite 6).
3. Chạy: `npm run dev` rồi mở `http://localhost:3000` — kiểm tra trang tải bình thường, sau đó
   dừng server (Ctrl+C).
4. Chạy: `npm run build` rồi `npm run preview` — kiểm tra bản build chạy đúng ở base path
   `/runes/`, sau đó dừng server.
5. Commit: `git add package.json package-lock.json && git commit -m "Upgrade Vite to v6 and @vitejs/plugin-react to a compatible version"`

## Task 3 — Thêm ESLint

**Create**: `d:\runes-main\eslint.config.js`

1. Cài đặt:
   `npm install --save-dev eslint@^9.17.0 typescript-eslint@^8.18.0 eslint-plugin-react-hooks@^5.1.0 @eslint/js@^9.17.0`
2. Tạo file `eslint.config.js`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  }
);
```

3. **Modify** `d:\runes-main\package.json` — thêm vào `scripts`:
   `"lint": "eslint ."`
4. Chạy: `npm run lint`
   Kỳ vọng: chạy xong, liệt kê lỗi/cảnh báo (nếu có) trên code hiện tại. Nếu có lỗi, sửa lỗi đó
   trước khi tiếp tục (không tắt rule để né lỗi).
5. Commit: `git add eslint.config.js package.json package-lock.json && git commit -m "Add ESLint with typescript-eslint and react-hooks plugin"`

## Task 4 — Thêm Vitest + React Testing Library

**Modify**: `d:\runes-main\vite.config.ts`, `d:\runes-main\package.json`
**Create**: `d:\runes-main\src\setupTests.ts`

1. Cài đặt:
   `npm install --save-dev vitest@^2.1.8 @testing-library/react@^16.1.0 @testing-library/jest-dom@^6.6.3 jsdom@^25.0.1`
2. Sửa `vite.config.ts` thành:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/runes/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  }
})
```

3. Tạo `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

4. **Modify** `package.json` — thêm vào `scripts`:
   `"test": "vitest run"`
5. Chạy: `npm run test`
   Kỳ vọng: `No test files found` (chưa có file test nào) — đây là kết quả đúng ở bước này.
6. Commit: `git add vite.config.ts package.json package-lock.json src/setupTests.ts && git commit -m "Add Vitest and React Testing Library tooling"`

## Task 5 — Trích xuất `pickRandomRunes` + test (TDD)

**Modify**: `d:\runes-main\src\data\runes.ts`, `d:\runes-main\src\components\RandomPullTab.tsx`
**Create**: `d:\runes-main\src\data\runes.test.ts`

1. Viết file test trước (sẽ fail vì `pickRandomRunes` chưa tồn tại). Tạo
   `src/data/runes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { runes, interpolateAdvice, pickRandomRunes } from './runes';

describe('pickRandomRunes', () => {
  it('trả về đúng số lượng rune và không trùng lặp', () => {
    const picked = pickRandomRunes(5);
    expect(picked).toHaveLength(5);
    const uniqueIds = new Set(picked.map((rune) => rune.id));
    expect(uniqueIds.size).toBe(5);
  });

  it('có thể rút toàn bộ số rune trong bộ bài mà không trùng lặp', () => {
    const picked = pickRandomRunes(runes.length);
    expect(picked).toHaveLength(runes.length);
    const uniqueIds = new Set(picked.map((rune) => rune.id));
    expect(uniqueIds.size).toBe(runes.length);
  });

  it('báo lỗi nếu yêu cầu nhiều hơn số rune có trong bộ bài', () => {
    expect(() => pickRandomRunes(runes.length + 1)).toThrow();
  });
});

describe('interpolateAdvice', () => {
  it('thay thế {subject} bằng chủ đề câu hỏi', () => {
    const fehu = runes.find((rune) => rune.id === 'fehu')!;
    const result = interpolateAdvice(fehu, 'công việc mới');
    expect(result).toContain('công việc mới');
    expect(result).not.toContain('{subject}');
  });

  it('thay thế {name} bằng tên rune', () => {
    const uruz = runes.find((rune) => rune.id === 'uruz')!;
    const result = interpolateAdvice(uruz, 'tình huống của bạn');
    expect(result).toContain('Uruz');
    expect(result).not.toContain('{name}');
  });
});
```

2. Chạy: `npm run test`
   Kỳ vọng: thất bại với lỗi `pickRandomRunes is not exported` (hoặc tương tự) — xác nhận test
   đang fail đúng lý do.
3. Thêm hàm `pickRandomRunes` vào cuối `src/data/runes.ts` (sau `getRandomRune`, trước
   `interpolateAdvice`):

```ts
/**
 * Rút ngẫu nhiên `count` rune không trùng lặp từ `pool` (mặc định là toàn bộ bộ bài).
 * Ném lỗi nếu `count` lớn hơn số rune có sẵn trong `pool`.
 */
export const pickRandomRunes = (count: number, pool: Rune[] = runes): Rune[] => {
  if (count > pool.length) {
    throw new Error(`Không thể rút ${count} rune không trùng lặp từ bộ bài chỉ có ${pool.length} rune.`);
  }
  const picked: Rune[] = [];
  const usedIndices = new Set<number>();
  while (picked.length < count) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      picked.push(pool[randomIndex]);
    }
  }
  return picked;
};
```

4. Chạy: `npm run test`
   Kỳ vọng: cả 5 test pass (`5 passed`).
5. Sửa `src/components/RandomPullTab.tsx` — đổi import và dùng hàm mới thay vì vòng lặp inline:
   - Đổi dòng `import { runes, Rune, interpolateAdvice } from '../data/runes';` thành
     `import { runes, Rune, interpolateAdvice, pickRandomRunes } from '../data/runes';`
   - Trong `pullHorizontalRunes`, thay toàn bộ thân hàm bằng:

```ts
  const pullHorizontalRunes = () => {
    const count = getRuneCountNumber(horizontalRuneCount);
    setHorizontalPulledRunes(pickRandomRunes(count));
    setRevealedCardIndices([]);
  };
```

6. Chạy: `npm run dev`, mở tab "Tiên đoán", bấm mỗi lựa chọn số lượng rune (1/2/3/5) và bấm
   "Tiên đoán" — xác nhận vẫn rút đúng số lá, không trùng lặp, giống hành vi trước khi sửa. Dừng
   server.
7. Chạy: `npm run test` — kỳ vọng vẫn `5 passed`.
8. Commit: `git add src/data/runes.ts src/data/runes.test.ts src/components/RandomPullTab.tsx && git commit -m "Extract pickRandomRunes helper and add tests for draw/advice logic"`

## Task 6 — Smoke test cho App trước khi tái cấu trúc

**Create**: `d:\runes-main\src\App.test.tsx`

1. Tạo file:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('hiển thị tiêu đề và mặc định chọn tab Tiên đoán', () => {
    render(<App />);
    expect(screen.getByText('Rune Elder Futhark')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tiên đoán' })).toHaveClass('active');
  });
});
```

2. Chạy: `npm run test`
   Kỳ vọng: `6 passed` (5 test cũ + test mới này chạy trên `App.tsx` hiện tại, chưa tái cấu
   trúc).
3. Commit: `git add src/App.test.tsx && git commit -m "Add App render smoke test as a regression guard before refactor"`

## Task 7 — Tạo `types.ts` dùng chung

**Create**: `d:\runes-main\src\types.ts`

1. Tạo file:

```ts
export type TabId = 'dictionary' | 'bindrunes' | 'wyrd' | 'randompull' | 'history';
```

2. Commit: `git add src/types.ts && git commit -m "Add shared TabId type"`

## Task 8 — Tách `Nav.tsx`

**Create**: `d:\runes-main\src\components\Nav.tsx`

1. Tạo file:

```tsx
import { TabId } from '../types';

interface NavItem {
  id: TabId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'randompull', label: 'Tiên đoán' },
  { id: 'dictionary', label: 'Từ điển Rune' },
  { id: 'bindrunes', label: 'Bindrunes' },
  { id: 'wyrd', label: 'Mạng lưới định mệnh (Wyrd)' },
  { id: 'history', label: 'Lịch sử Rune' }
];

interface NavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

/** Thanh điều hướng tab — 1 danh sách nút dùng chung cho cả desktop và mobile menu. */
function Nav({ activeTab, onTabChange, isMobile, isMobileMenuOpen, onToggleMobileMenu }: NavProps) {
  const buttons = NAV_ITEMS.map((item) => (
    <button
      key={item.id}
      className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
      onClick={() => onTabChange(item.id)}
    >
      {item.label}
    </button>
  ));

  if (!isMobile) {
    return <nav className="top-nav">{buttons}</nav>;
  }

  return (
    <>
      <button
        onClick={onToggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        style={{
          background: 'linear-gradient(145deg, #1e2330, #0f121a)', border: '1px solid rgba(99, 179, 237, 0.3)',
          borderRadius: '8px', color: '#e8f4fd', padding: '0.75rem 1rem', fontSize: '0.85rem', cursor: 'pointer', zIndex: 1001
        }}
      >
        <span>☰</span> {isMobileMenuOpen ? 'Đóng Menu' : 'Mở Menu'}
      </button>

      {isMobileMenuOpen && (
        <nav className="top-nav" style={{
          position: 'fixed', top: '140px', left: 0, right: 0, background: 'rgba(8, 10, 15, 0.98)',
          backdropFilter: 'blur(15px)', borderTop: '1px solid rgba(99, 179, 237, 0.2)', padding: '1rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 1000
        }}>
          {buttons}
        </nav>
      )}
    </>
  );
}

export default Nav;
```

2. Commit: `git add src/components/Nav.tsx && git commit -m "Extract shared Nav component from App.tsx"`

## Task 9 — Tách `ImageLightbox.tsx`

**Create**: `d:\runes-main\src\components\ImageLightbox.tsx`

1. Tạo file:

```tsx
interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

/** Modal phóng to ảnh — không render gì nếu `src` là null. */
function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ảnh phóng to"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5, 7, 10, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', maxWidth: 'min(95vw, 1600px)', maxHeight: 'min(95vh, 1000px)' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Đóng ảnh phóng to"
          style={{
            position: 'absolute', top: '-2.5rem', right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '999px', color: '#e8f4fd', width: '2rem', height: '2rem', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1
          }}
        >
          ✕
        </button>
        <img src={src} alt="Ảnh phóng to" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.3)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)' }} />
      </div>
    </div>
  );
}

export default ImageLightbox;
```

2. Commit: `git add src/components/ImageLightbox.tsx && git commit -m "Extract ImageLightbox component from App.tsx"`

## Task 10 — Tách `DictionaryTab.tsx`

**Create**: `d:\runes-main\src\components\tabs\DictionaryTab.tsx`

1. Tạo file:

```tsx
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
            <RuneAnnotations rune={rune} />
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', textAlign: 'justify', margin: '0', fontFamily: 'Inter, sans-serif' }}>{rune.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DictionaryTab;
```

Lưu ý: class `weave-in` và thuộc tính `animationDelay` chưa có hiệu lực hình ảnh cho tới Task 17
(khi CSS `weave-in` được thêm vào `index.css`) — không phải lỗi, chỉ là chưa tới lượt.

2. Commit: `git add src/components/tabs/DictionaryTab.tsx && git commit -m "Extract DictionaryTab component from App.tsx"`

## Task 11 — Tách `BindrunesTab.tsx`

**Create**: `d:\runes-main\src\components\tabs\BindrunesTab.tsx`

1. Tạo file:

```tsx
interface BindrunesTabProps {
  onImageClick: (src: string) => void;
}

/** Tab "Bindrunes": nội dung tĩnh giải thích bindrune + 2 ảnh minh họa có thể phóng to. */
function BindrunesTab({ onImageClick }: BindrunesTabProps) {
  return (
    <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Bindrunes (Mật Chú Phối Hợp)</h2>
      <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#cbd5e0', lineHeight: '1.6' }}>
        <strong>Bindrune</strong> là sự kết hợp của hai hoặc nhiều rune thành một biểu tượng duy nhất. Chúng thường được dùng để tạo nên biểu tượng mang ý định tổng hợp từ nhiều ý nghĩa rune khác nhau.
      </p>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Cách thức vận hành của Bindrune</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Khi tạo ra một bindrune, các biểu tượng cổ tự sẽ được xếp chồng lên nhau, đồng thời các đường nét chung được hợp nhất. Quá trình này tạo nên một ký tự đồng nhất mang theo ý định và sức mạnh tổng hợp của từng rune đơn lẻ. Các bindrune phổ biến thường là sự kết hợp của 2-3 chữ, dù trên thực tế vẫn tồn tại những cấu trúc phức tạp hơn.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Tự tạo Bindrune cho riêng bạn</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Để kiến tạo một bindrune, trước hết hãy xác định các cổ tự có tầng ý nghĩa tương hợp với mong muốn của bạn. Sau đó, hãy phác thảo cách chúng chồng lên nhau hoặc dùng chung các nét trục. Mục tiêu là tạo nên một biểu tượng hài hòa, cân bằng, chuyển động tự nhiên nhưng vẫn giữ được các đặc điểm nhận diện cốt lõi của từng chữ.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #1b202e, #0e111a)', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.2)' }}>
          <img src={`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`} alt="Bindrune ghép Thurisaz và Raidho" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`)} />
          <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Thurisaz + Raidho</h4>
          <p style={{ fontSize: '0.9rem', color: '#63b3ed', marginBottom: '0.5rem' }}>Protection + Journey</p>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e0', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'justify' }}>
            Sự kết hợp giữa lá chắn phòng thủ kiên cố của Thurisaz và sự định hướng luân chuyển trôi chảy của Raidho. Mật chú này thường dùng cầu bình an, bảo hộ chủ nhân vững bước trên mọi chuyến đi xa hoặc các bước chuyển mình lớn của tâm thức.
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #1b202e, #0e111a)', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.2)' }}>
          <img src={`${import.meta.env.BASE_URL}bindruneingwazothala1.png`} alt="Bindrune ghép Ingwaz và Othala" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}bindruneingwazothala1.png`)} />
          <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Ingwaz + Othala</h4>
          <p style={{ fontSize: '0.9rem', color: '#63b3ed', marginBottom: '0.5rem' }}>Fertility + Heritage</p>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e0', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'justify' }}>
            Nối liền kén năng lượng trù phú gieo trồng của Ingwaz với bệ đỡ vững chắc từ gia sản tổ tiên Othala. Biểu thị cho sự tiếp nối vững vàng bền bỉ, tạo lập nền tảng gia đình sung túc hoặc tiếp thêm nội lực vững chắc để thực hiện những kế hoạch dài hạn.
          </p>
        </div>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Cách sử dụng Bindrune</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Bindrune có thể được khắc lên gỗ, đá, kim loại, vẽ trên giấy, hoặc quán tưởng trong tâm trí cùng vô vàn hình thức thể hiện khác. Chúng thường được ứng dụng để cầu bình an, bảo hộ, định hướng lối đi, hoặc tập trung năng lượng hiện thực hóa một tâm nguyện cụ thể. Sức mạnh của bindrune đến từ ý chí tập trung cao độ phối hợp nhịp nhàng với tần số năng lượng của các cổ tự.
        </p>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ fontStyle: 'italic', opacity: 0.8, color: '#b8d4e6' }}>
          Khi các rune được kết nối với nhau, ý nghĩa của chúng cộng hưởng. Hãy chọn cẩn thận, vì bindrune trở thành biểu tượng sống cho ý định của bạn.
        </p>
      </div>
    </div>
  );
}

export default BindrunesTab;
```

2. Commit: `git add src/components/tabs/BindrunesTab.tsx && git commit -m "Extract BindrunesTab component from App.tsx"`

## Task 12 — Tách `WyrdTab.tsx`

**Create**: `d:\runes-main\src\components\tabs\WyrdTab.tsx`

1. Tạo file:

```tsx
interface WyrdTabProps {
  onImageClick: (src: string) => void;
}

/** Tab "Mạng lưới định mệnh (Wyrd)": nội dung tĩnh + 2 ảnh Web of Wyrd có thể phóng to. */
function WyrdTab({ onImageClick }: WyrdTabProps) {
  return (
    <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Mạng lưới định mệnh (Wyrd)</h2>
      <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#cbd5e0', lineHeight: '1.6' }}>
        <strong>Mạng lưới Wyrd</strong> biểu trưng cho bản chất liên kết chặt chẽ của vạn vật – giữa quá khứ, hiện tại và tương lai. Đây chính là tấm thảm định mệnh được ba vị nữ thần Norn dệt nên dưới rễ cây thế giới, nơi mỗi hành vi đơn lẻ đều tạo ra những gợn sóng lan tỏa khắp không gian và thời gian.
      </p>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>BA NỮ THẦN SỐ MỆNH (NORN)</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.8', textAlign: 'justify' }}>
          <strong>Urd (Quá khứ)</strong> – Người cai quản những gì đã qua, đại diện cho những sợi chỉ đã dệt cố định vào lòng thực tại.<br />
          <strong>Verdandi (Hiện tại)</strong> – Người biểu thị cho những gì đang diễn ra, khoảnh khắc của sự kiến tạo và quyền chủ động lựa chọn.<br />
          <strong>Skuld (Tương lai)</strong> – Người nắm giữ những gì sẽ đến, đại diện cho tiềm năng và những hệ quả nối tiếp từ quá khứ.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>CỬU GIỚI</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Mạng lưới định mệnh kết nối trọn vẹn cả chín cõi giới trong vũ trụ quan thần thoại Bắc Âu, từ đỉnh Asgard linh thiêng đến vực sâu Hel tối tăm. Mỗi thế giới đều tác động qua lại lẫn nhau, và những sợi chỉ của Wyrd buộc chặt chúng lại trong vũ điệu nhân quả vĩnh cửu.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>HIỂU VỀ WYRD</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Wyrd không đơn thuần là số phận hay định mệnh an bài cố định, mà là một hệ thống mạng lưới phức tạp đan xen giữa các mối quan hệ, những quyết định và hệ quả định hình nên cuộc đời ta. Mỗi lựa chọn ta đưa ra đều tác động tới mô thức chung, và mỗi hành động đều lan tỏa chạm đến vạn vật xung quanh. Quá khứ ảnh hưởng tới hiện tại, hiện tại tạo hình tương lai, nhưng sâu thẳm bên trong, ta luôn giữ quyền tự do để chọn cách bước đi trên con đường của chính mình.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <img src={`${import.meta.env.BASE_URL}webofwyrd1.png`} alt="Web of Wyrd 1" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}webofwyrd1.png`)} />
        <img src={`${import.meta.env.BASE_URL}webofwyrd2.png`} alt="Web of Wyrd 2" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}webofwyrd2.png`)} />
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>BIỂU TƯỢNG</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Toàn bộ 24 Rune Elder Futhark đều có thể được tìm thấy trong Mạng lưới Wyrd. Khi học rune, ta cũng đang đọc các mô thức của chính Wyrd. Rune không tách khỏi Lưới, mà là một phần của nó được biểu hiện thành ký hiệu. Khi bạn rút rune hoặc làm việc với chúng, bạn đang chạm vào các sợi Wyrd. Mỗi rune mang một phần trí tuệ của Lưới và có thể hé lộ cách quá khứ, hiện tại, tương lai đan vào đời sống của bạn.
        </p>
      </div>
    </div>
  );
}

export default WyrdTab;
```

2. Commit: `git add src/components/tabs/WyrdTab.tsx && git commit -m "Extract WyrdTab component from App.tsx"`

## Task 13 — Tách `HistoryTab.tsx`

**Create**: `d:\runes-main\src\components\tabs\HistoryTab.tsx`

1. Tạo file:

```tsx
/** Tab "Lịch sử Rune": nội dung tĩnh, không cần props. */
function HistoryTab() {
  return (
    <div className="rune-card" style={{ maxWidth: '800px', margin: '3rem auto', padding: '2.5rem', color: '#e8f4fd', fontSize: '1.05rem', lineHeight: 1.75 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.2rem', color: '#b8d4e6', textShadow: '0 0 12px #63b3ed' }}>
        Lịch Sử Của Hệ Thống Chữ Rune Cổ
      </h2>
      <p style={{ fontStyle: 'italic', color: '#63b3ed', marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
        "Chín đêm dài ta treo mình trên cây gió cuốn, bị giáo đâm, dâng tới Odin, chính ta dâng mình cho chính ta..."
      </p>
      <p style={{ textAlign: 'justify', marginBottom: '1.25rem' }}>
        Ẩn khuất trong làn sương mù thần thoại Bắc Âu, trước khi thế giới hình thành, chữ Rune vốn đã ẩn chứa vô vàn bí ẩn, luồn sâu vào cấu trúc tồn tại của thế giới. Ngay cả chư thần thuở sơ khai cũng không thể thấu thị được hết quyền năng ẩn giấu của chúng. Chính Odin - Phụ Thần tối cao, là người khao khát có được tri thức vĩ đại ấy hơn hết thảy.
      </p>
      <p style={{ textAlign: 'justify', marginBottom: '1.25rem' }}>
        Ngài đã tự hiến tế, treo mình trên Cây Thế Giới Yggdrasil suốt chín ngày chín đêm ròng rã. Thân xác Ngài bị đâm xuyên bởi chính ngọn giáo thần Gungnir, chịu đựng trạng thái không ăn, không uống, cô độc chống chọi với cuồng phong bão tuyết. Trong khoảnh khắc cận kề lằn ranh sinh tử, khi nhìn sâu xuống giếng thiêng Urd - nơi các Norn dệt thảm định mệnh, những cổ tự Rune quyền năng đã tự hiện hình và khải huyền sức mạnh, ma thuật và vận mệnh của chúng cho ông.
      </p>
    </div>
  );
}

export default HistoryTab;
```

2. Commit: `git add src/components/tabs/HistoryTab.tsx && git commit -m "Extract HistoryTab component from App.tsx"`

## Task 14 — Viết lại `App.tsx` để dùng các component mới

**Modify**: `d:\runes-main\src\App.tsx`

1. Thay toàn bộ nội dung `src/App.tsx` bằng:

```tsx
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import ImageLightbox from './components/ImageLightbox';
import RandomPullTab from './components/RandomPullTab';
import DictionaryTab from './components/tabs/DictionaryTab';
import BindrunesTab from './components/tabs/BindrunesTab';
import WyrdTab from './components/tabs/WyrdTab';
import HistoryTab from './components/tabs/HistoryTab';
import { TabId } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('randompull');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  useEffect(() => {
    if (!enlargedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnlargedImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedImage]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <div className="top-band">
        <div className="top-band-content">
          <h1 className="app-title" style={{ letterSpacing: '0.12em', textShadow: '0 0 15px rgba(232,244,253,0.3)', fontSize: '2rem' }}>Rune Elder Futhark</h1>
          <Nav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <div key={activeTab} className="tab-content weave-in">
          {activeTab === 'dictionary' && <DictionaryTab />}
          {activeTab === 'randompull' && <RandomPullTab isMobile={isMobile} />}
          {activeTab === 'bindrunes' && <BindrunesTab onImageClick={setEnlargedImage} />}
          {activeTab === 'wyrd' && <WyrdTab onImageClick={setEnlargedImage} />}
          {activeTab === 'history' && <HistoryTab />}
        </div>

        <ImageLightbox src={enlargedImage} onClose={closeEnlargedImage} />
      </div>
    </>
  );
}

export default App;
```

Lưu ý: dòng `<div key={activeTab} className="tab-content weave-in">` đã đưa 1 phần của Task 17
(Dệt Mở) vào luôn ở đây vì nó nằm trong chính file `App.tsx` — class `weave-in` chưa có hiệu lực
hình ảnh cho tới khi Task 17 thêm CSS tương ứng, giống lưu ý ở Task 10.

2. Chạy: `npm run test`
   Kỳ vọng: `6 passed` — test `App.test.tsx` viết ở Task 6 vẫn pass y hệt sau khi tái cấu trúc,
   xác nhận hành vi không đổi.
3. Chạy: `npm run lint` — kỳ vọng không có lỗi mới.
4. Chạy: `npm run dev`, kiểm tra bằng mắt trên trình duyệt:
   - Cả 5 tab hiển thị đúng nội dung như trước (Tiên đoán, Từ điển, Bindrunes, Wyrd, Lịch sử).
   - Thu nhỏ cửa sổ xuống dưới 1024px, xác nhận menu mobile (nút "☰ Mở Menu") hoạt động đúng,
     đóng lại sau khi chọn tab.
   - Vào tab Bindrunes/Wyrd, bấm vào ảnh minh họa, xác nhận modal phóng to mở ra, bấm ✕ hoặc
     phím Escape để đóng.
   Dừng server sau khi kiểm tra xong.
5. Commit: `git add src/App.tsx && git commit -m "Rewrite App.tsx to compose extracted tab and layout components"`

## Task 15 — Hiệu ứng Dệt Mở (CSS)

**Modify**: `d:\runes-main\src\index.css`

1. Thêm vào cuối `src/index.css`:

```css
/* ============================================================
   Hiệu ứng "Dệt Mở" — fade + trượt lên khi tab/thẻ xuất hiện.
   ============================================================ */
@keyframes weave-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.weave-in {
  animation: weave-in 0.5s cubic-bezier(0.22, 0.9, 0.32, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .weave-in {
    animation: none;
  }
}
```

2. Chạy: `npm run dev`, chuyển qua lại giữa các tab — xác nhận nội dung mỗi tab fade + trượt lên
   nhẹ khi xuất hiện; vào tab Từ điển, xác nhận các thẻ rune xuất hiện lệch nhịp nhau (không bật
   ra cùng lúc). Dừng server.
3. Commit: `git add src/index.css && git commit -m "Add Dệt Mở fade/slide-in animation for tab transitions"`

## Task 16 — Hiệu ứng Cộng Hưởng khi lật thẻ

**Modify**: `d:\runes-main\src\index.css`, `d:\runes-main\src\components\FlipCard.tsx`

1. Thêm vào cuối `src/index.css`:

```css
/* ============================================================
   Hiệu ứng "Cộng Hưởng" — vòng sáng lan tỏa 1 lần khi FlipCard lộ kết quả.
   ============================================================ */
.resonance {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}

.resonance-ring {
  position: absolute;
  width: 90%;
  height: 90%;
  border-radius: 12px;
  border: 1px solid rgba(99, 179, 237, 0.6);
  opacity: 0;
  animation: resonance-pulse 1.1s ease-out forwards;
}

.resonance-ring--delay-1 { animation-delay: 0.15s; }
.resonance-ring--delay-2 { animation-delay: 0.3s; }

@keyframes resonance-pulse {
  0% { opacity: 0.8; transform: scale(0.85); }
  100% { opacity: 0; transform: scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .resonance-ring {
    animation: none;
    opacity: 0;
  }
}
```

2. Sửa `src/components/FlipCard.tsx` — thêm khối `{isRevealed && (...)}` làm phần tử con cuối
   cùng của `<div className={`flip-card-container ...`}>`, ngang hàng với `.flip-card-inner`
   (không nằm bên trong nó, để tránh bị ảnh hưởng bởi `transform: rotateY` của flip 3D). Sửa
   phần return của `FlipCard` thành:

```tsx
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
          <span className="rune-symbol" style={{ fontSize: '2.8rem', marginBottom: '0.2rem', textShadow: '0 0 15px rgba(136,192,208,0.6)' }}>{rune.symbol}</span>
          <h3 className="rune-name" style={{ fontSize: '1.2rem', marginBottom: '0.15rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>{rune.name}</h3>
          <p className="rune-meaning" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: '#81a1c1' }}>
            <strong>{rune.meaning}</strong>
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
```

   (Chỉ phần `return (...)` đổi — phần import và `handleKeyDown` phía trên giữ nguyên như hiện
   tại.)

3. Chạy: `npm run dev`, vào tab Tiên đoán, rút bài rồi bấm lật 1 lá — xác nhận thấy vòng sáng lan
   tỏa đúng 1 lần lúc lộ kết quả, không lặp lại nếu bấm lại lá đã lật. Dừng server.
4. Commit: `git add src/index.css src/components/FlipCard.tsx && git commit -m "Add Cộng Hưởng resonance-ring effect when a FlipCard is revealed"`

## Task 17 — Hiệu ứng Sương Sao (chỉ tab Tiên đoán)

**Create**: `d:\runes-main\src\components\StarMist.tsx`
**Modify**: `d:\runes-main\src\components\RandomPullTab.tsx`

1. Tạo `src/components/StarMist.tsx`:

```tsx
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

/**
 * Nền hạt sáng trôi nhẹ, chỉ dùng trong tab Tiên đoán. Tự dừng vòng lặp vẽ khi
 * tab trình duyệt bị ẩn (document.hidden) hoặc khi component unmount, để không
 * tốn CPU/pin trên các thiết bị yếu khi người dùng không nhìn vào nó.
 */
function StarMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrameId = 0;
    let isRunning = true;

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    const createParticles = () => {
      particles = Array.from({ length: 26 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vy: 0.08 + Math.random() * 0.18,
        vx: (Math.random() - 0.5) * 0.08,
        a: 0.15 + Math.random() * 0.5
      }));
    };

    const draw = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(136, 192, 208, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      draw();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

export default StarMist;
```

2. Sửa `src/components/RandomPullTab.tsx`:
   - Thêm import: `import StarMist from './StarMist';` (ngay dưới dòng import `FlipCard`).
   - Đổi dòng mở đầu JSX từ:
     ```tsx
     <div style={{ maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
     ```
     thành:
     ```tsx
     <div style={{ maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', position: 'relative' }}>
       <StarMist />
       <div style={{ position: 'relative', zIndex: 1 }}>
     ```
   - Thêm 1 thẻ `</div>` đóng ngay trước thẻ `</div>` cuối cùng đang đóng phần tử gốc của
     component (đảm bảo toàn bộ nội dung hiện có — 3 cột chọn số lượng + hàng FlipCard — nằm
     trong `<div style={{ position: 'relative', zIndex: 1 }}>` mới thêm, để nổi lên trên canvas
     Sương Sao). Toàn bộ JSX bên trong (từ khối 3 cột cho tới hàng FlipCard) giữ nguyên không
     đổi, chỉ đổi 2 dòng bọc ngoài như trên.
3. Chạy: `npm run dev`, vào tab Tiên đoán — xác nhận thấy các đốm sáng nhỏ trôi chậm phía sau
   nội dung, không che khuất chữ/nút. Chuyển sang tab khác rồi quay lại — xác nhận không bị giật
   lag tích lũy (particle field khởi tạo lại sạch mỗi lần vào tab, do component `StarMist`
   unmount/remount cùng `RandomPullTab`). Mở DevTools → tab Performance hoặc đơn giản chuyển
   sang tab trình duyệt khác vài giây rồi quay lại — xác nhận không có lỗi console. Dừng server.
4. Commit: `git add src/components/StarMist.tsx src/components/RandomPullTab.tsx && git commit -m "Add Sương Sao particle background, scoped to the RandomPullTab only"`

## Task 18 — Kiểm tra tổng thể cuối cùng

1. Chạy tuần tự, tất cả phải thành công:
   - `npm run build`
   - `npm run lint`
   - `npm run test`
2. Chạy `npm run preview`, mở trang, kiểm tra lại toàn bộ:
   - 5 tab hiển thị đúng, hiệu ứng Dệt Mở khi chuyển tab.
   - Rút quẻ ở cả 4 chế độ (1/2/3/5 rune), lật từng lá thấy hiệu ứng Cộng Hưởng đúng 1 lần.
   - Tab Tiên đoán có Sương Sao chạy nền; các tab khác không có.
   - Giao diện responsive mobile (menu ☰) hoạt động như cũ.
   - Modal phóng to ảnh ở Bindrunes/Wyrd hoạt động như cũ.
   Dừng server sau khi kiểm tra.
3. Không commit gì thêm ở bước này nếu không phát hiện vấn đề — đây là bước xác nhận cuối cùng.
