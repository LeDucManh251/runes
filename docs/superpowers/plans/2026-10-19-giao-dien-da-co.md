# Giao diện "Đá cổ" (phần 1/2)

**Sub-skill bắt buộc để thực thi**: Subagent-Driven Development (khuyến nghị) hoặc Inline
Execution — người dùng chọn sau khi plan này được duyệt.

**Spec gốc**: `docs/superpowers/specs/2026-10-19-giao-dien-da-co-design.md`

## Goal

Thay ba bảng màu lẫn lộn bằng một hệ design token "Đá cổ" (than đá ấm + vàng hổ phách), menu dạng
chữ một hàng, thành phần dùng chung (`.panel`, `.btn`, `.btn-ghost`, `.input`, `.tag`), áp cho mọi
tab; bỏ style inline (trừ `RandomPullTab` chỉ đổi màu), bỏ căn đều hai bên, xử lý ảnh nền trắng
bằng CSS, cho ảnh mở phóng to bằng bàn phím.

## Architecture

```
src/
  index.css                       (VIẾT LẠI) — token :root, base, header/nav, thành phần dùng chung,
                                              prose/figure, lightbox, từ điển, tooltip, lá bài,
                                              hiệu ứng, Viết tên. Xóa .nav-button/.pull-button cũ.
  App.tsx                         (SỬA) — bỏ inline style của tiêu đề và container
  App.test.tsx                    (SỬA) — aria-current, mở ảnh bằng Enter
  components/
    Nav.tsx                       (SỬA) — tab dạng chữ, nhãn rút gọn, menu mobile absolute
    ZoomableImage.tsx             (TẠO) — ảnh bấm/Enter/Space để phóng to, lazy load
    ImageLightbox.tsx             (SỬA) — dùng class, autoFocus nút đóng
    RuneAnnotations.tsx           (SỬA) — dùng .tag + class tooltip
    FlipCard.tsx                  (SỬA) — dùng class, chỉ giữ inline transform xoay khi ngược
    StarMist.tsx                  (SỬA) — hạt màu hổ phách
    RandomPullTab.tsx             (SỬA) — chỉ thay màu inline bằng var(--…), nút dùng .btn
    tabs/
      BindrunesTab.tsx            (SỬA) — class prose/figure + ZoomableImage
      WyrdTab.tsx                 (SỬA) — class prose/figure + ZoomableImage, tiêu đề viết thường
      HistoryTab.tsx              (SỬA) — class prose
      DictionaryTab.tsx           (SỬA) — class, aria-label ô tìm kiếm
      NameWriterTab.tsx           (SỬA) — ô nhập .input, nút sao chép .btn
```

## Tech Stack

React 18 + TypeScript, CSS thuần (custom properties), Vitest + RTL. Kiểm tra trực quan bằng
`playwright-core` + Chrome cài sẵn (trong scratchpad, không thêm vào dự án).

Ghi chú lệch nhẹ so với spec (đã cân nhắc):
- Thêm 6 token phụ (`--band`, `--overlay`, `--accent-hover`, `--accent-glow`, `--stripes`,
  `--shadow`) để thỏa yêu cầu "mọi màu chỉ qua biến" cho các giá trị spec viết dạng rgba trực tiếp.
- Tiêu đề app ở ≤480px dùng `1.05rem` / `0.1em` thay cho `1.15rem` / `0.12em`: tính theo bề
  rộng chữ Cormorant viết hoa, 1.15rem cộng nút menu sát mức 375px. Tiêu chí thật vẫn là
  overflow = 0 ở 375px (Task 8).

---

## Task 1 — Viết lại `index.css`

**Modify**: `d:\runes-main\src\index.css` — thay **toàn bộ** nội dung bằng file trong Phụ lục A.

1. Ghi Phụ lục A vào `src/index.css`.
2. `npm test` → PASS (CSS không ảnh hưởng test).
3. `grep -nE "#[0-9a-fA-F]{3,6}\b" src/index.css` → mọi dòng khớp đều nằm trong khối `:root`
   (dòng 6–48).
4. Commit: `Rewrite stylesheet around Đá cổ design tokens`

(Sau task này, các component chưa đổi class sẽ trông lệch cho tới khi các task sau hoàn tất; build
và test vẫn chạy.)

## Task 2 — Header, menu (TDD)

**Modify**: `src/App.test.tsx`, `src/components/Nav.tsx`, `src/App.tsx`

1. Trong `App.test.tsx`, ngay sau dòng kiểm tra `toHaveClass('active')`, thêm:
   ```tsx
       expect(within(nav).getByRole('button', { name: 'Tiên đoán' })).toHaveAttribute('aria-current', 'page');
       expect(within(nav).getByRole('button', { name: 'Từ điển' })).not.toHaveAttribute('aria-current');
   ```
2. `npx vitest run src/App.test.tsx` → **FAIL** (chưa có `aria-current`, nhãn vẫn "Từ điển Rune").
3. `Nav.tsx` thành:
   ```tsx
   import { TabId } from '../types';

   interface NavItem {
     id: TabId;
     label: string;
   }

   const NAV_ITEMS: NavItem[] = [
     { id: 'randompull', label: 'Tiên đoán' },
     { id: 'namewriter', label: 'Viết tên' },
     { id: 'dictionary', label: 'Từ điển' },
     { id: 'bindrunes', label: 'Bindrunes' },
     { id: 'wyrd', label: 'Wyrd' },
     { id: 'history', label: 'Lịch sử' }
   ];

   interface NavProps {
     activeTab: TabId;
     onTabChange: (tab: TabId) => void;
     isMobile: boolean;
     isMobileMenuOpen: boolean;
     onToggleMobileMenu: () => void;
   }

   /** Thanh điều hướng tab dạng chữ — 1 danh sách dùng chung cho desktop và menu thả xuống trên mobile. */
   function Nav({ activeTab, onTabChange, isMobile, isMobileMenuOpen, onToggleMobileMenu }: NavProps) {
     const tabs = NAV_ITEMS.map((item) => {
       const isActive = activeTab === item.id;
       return (
         <button
           key={item.id}
           type="button"
           className={`nav-tab ${isActive ? 'active' : ''}`}
           aria-current={isActive ? 'page' : undefined}
           onClick={() => onTabChange(item.id)}
         >
           {item.label}
         </button>
       );
     });

     if (!isMobile) {
       return <nav className="top-nav" aria-label="Điều hướng chính">{tabs}</nav>;
     }

     return (
       <>
         <button type="button" className="btn btn-ghost menu-toggle" onClick={onToggleMobileMenu} aria-expanded={isMobileMenuOpen}>
           {isMobileMenuOpen ? '✕ Đóng' : '☰ Menu'}
         </button>
         {isMobileMenuOpen && <nav className="top-nav mobile-menu" aria-label="Điều hướng chính">{tabs}</nav>}
       </>
     );
   }

   export default Nav;
   ```
4. `App.tsx`: đổi
   ```tsx
             <h1 className="app-title" style={{ letterSpacing: '0.12em', textShadow: '0 0 15px rgba(232,244,253,0.3)', fontSize: '2rem' }}>Rune Elder Futhark</h1>
   ```
   thành
   ```tsx
             <h1 className="app-title">Rune Elder Futhark</h1>
   ```
   và `<div className="container" style={{ paddingTop: '1.5rem' }}>` thành `<div className="container">`.
5. `npx vitest run src/App.test.tsx` → **PASS**.
6. Commit: `Restyle header with text tabs and shorter labels`

## Task 3 — `ZoomableImage` + tab Bindrunes, Wyrd, Lịch sử + lightbox (TDD)

**Create**: `src/components/ZoomableImage.tsx`
**Modify**: `src/App.test.tsx`, `src/components/ImageLightbox.tsx`,
`src/components/tabs/BindrunesTab.tsx`, `src/components/tabs/WyrdTab.tsx`,
`src/components/tabs/HistoryTab.tsx`

1. Thêm test vào cuối `describe('App', ...)` trong `App.test.tsx` (sửa import đầu file thành
   `import { fireEvent, render, screen, within } from '@testing-library/react';`):
   ```tsx
     it('mở ảnh bindrune phóng to bằng phím Enter', () => {
       render(<App />);
       fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Bindrunes' }));
       fireEvent.keyDown(screen.getByRole('button', { name: 'Bindrune ghép Thurisaz và Raidho' }), { key: 'Enter' });
       expect(screen.getByRole('dialog', { name: 'Ảnh phóng to' })).toBeInTheDocument();
     });
   ```
2. `npx vitest run src/App.test.tsx` → **FAIL** (ảnh chưa có `role="button"`).
3. Tạo `ZoomableImage.tsx`:
   ```tsx
   import { KeyboardEvent } from 'react';

   interface ZoomableImageProps {
     src: string;
     alt: string;
     className?: string;
     onOpen: (src: string) => void;
   }

   /** Ảnh minh họa bấm chuột hoặc Enter/Space để phóng to; tải lười để không chặn trang. */
   function ZoomableImage({ src, alt, className = '', onOpen }: ZoomableImageProps) {
     const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         onOpen(src);
       }
     };

     return (
       <img
         src={src}
         alt={alt}
         className={`figure-img ${className}`.trim()}
         role="button"
         tabIndex={0}
         loading="lazy"
         decoding="async"
         onClick={() => onOpen(src)}
         onKeyDown={handleKeyDown}
       />
     );
   }

   export default ZoomableImage;
   ```
4. `BindrunesTab.tsx` thành:
   ```tsx
   import ZoomableImage from '../ZoomableImage';

   interface BindrunesTabProps {
     onImageClick: (src: string) => void;
   }

   const THURISAZ_RAIDHO = `${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`;
   const INGWAZ_OTHALA = `${import.meta.env.BASE_URL}bindruneingwazothala1.png`;

   /** Tab "Bindrunes": nội dung tĩnh giải thích bindrune + 2 ảnh minh họa có thể phóng to. */
   function BindrunesTab({ onImageClick }: BindrunesTabProps) {
     return (
       <article className="rune-card prose">
         <h2 className="prose-title">Bindrunes (Mật Chú Phối Hợp)</h2>
         <p className="prose-lead">
           <strong>Bindrune</strong> là sự kết hợp của hai hoặc nhiều rune thành một biểu tượng duy nhất. Chúng thường được dùng để tạo nên biểu tượng mang ý định tổng hợp từ nhiều ý nghĩa rune khác nhau.
         </p>
         <section className="prose-section">
           <h3 className="prose-heading">Cách thức vận hành của Bindrune</h3>
           <p className="prose-text">
             Khi tạo ra một bindrune, các biểu tượng cổ tự sẽ được xếp chồng lên nhau, đồng thời các đường nét chung được hợp nhất. Quá trình này tạo nên một ký tự đồng nhất mang theo ý định và sức mạnh tổng hợp của từng rune đơn lẻ. Các bindrune phổ biến thường là sự kết hợp của 2-3 chữ, dù trên thực tế vẫn tồn tại những cấu trúc phức tạp hơn.
           </p>
         </section>
         <section className="prose-section">
           <h3 className="prose-heading">Tự tạo Bindrune cho riêng bạn</h3>
           <p className="prose-text">
             Để kiến tạo một bindrune, trước hết hãy xác định các cổ tự có tầng ý nghĩa tương hợp với mong muốn của bạn. Sau đó, hãy phác thảo cách chúng chồng lên nhau hoặc dùng chung các nét trục. Mục tiêu là tạo nên một biểu tượng hài hòa, cân bằng, chuyển động tự nhiên nhưng vẫn giữ được các đặc điểm nhận diện cốt lõi của từng chữ.
           </p>
         </section>
         <div className="figure-grid">
           <figure className="figure">
             <ZoomableImage src={THURISAZ_RAIDHO} alt="Bindrune ghép Thurisaz và Raidho" onOpen={onImageClick} />
             <h4 className="figure-title">Thurisaz + Raidho</h4>
             <p className="figure-subtitle">Protection + Journey</p>
             <p className="figure-caption">
               Sự kết hợp giữa lá chắn phòng thủ kiên cố của Thurisaz và sự định hướng luân chuyển trôi chảy của Raidho. Mật chú này thường dùng cầu bình an, bảo hộ chủ nhân vững bước trên mọi chuyến đi xa hoặc các bước chuyển mình lớn của tâm thức.
             </p>
           </figure>
           <figure className="figure">
             <ZoomableImage src={INGWAZ_OTHALA} alt="Bindrune ghép Ingwaz và Othala" onOpen={onImageClick} />
             <h4 className="figure-title">Ingwaz + Othala</h4>
             <p className="figure-subtitle">Fertility + Heritage</p>
             <p className="figure-caption">
               Nối liền kén năng lượng trù phú gieo trồng của Ingwaz với bệ đỡ vững chắc từ gia sản tổ tiên Othala. Biểu thị cho sự tiếp nối vững vàng bền bỉ, tạo lập nền tảng gia đình sung túc hoặc tiếp thêm nội lực vững chắc để thực hiện những kế hoạch dài hạn.
             </p>
           </figure>
         </div>
         <section className="prose-section">
           <h3 className="prose-heading">Cách sử dụng Bindrune</h3>
           <p className="prose-text">
             Bindrune có thể được khắc lên gỗ, đá, kim loại, vẽ trên giấy, hoặc quán tưởng trong tâm trí cùng vô vàn hình thức thể hiện khác. Chúng thường được ứng dụng để cầu bình an, bảo hộ, định hướng lối đi, hoặc tập trung năng lượng hiện thực hóa một tâm nguyện cụ thể. Sức mạnh của bindrune đến từ ý chí tập trung cao độ phối hợp nhịp nhàng với tần số năng lượng của các cổ tự.
           </p>
         </section>
         <p className="prose-closing">
           Khi các rune được kết nối với nhau, ý nghĩa của chúng cộng hưởng. Hãy chọn cẩn thận, vì bindrune trở thành biểu tượng sống cho ý định của bạn.
         </p>
       </article>
     );
   }

   export default BindrunesTab;
   ```
5. `WyrdTab.tsx` thành:
   ```tsx
   import ZoomableImage from '../ZoomableImage';

   interface WyrdTabProps {
     onImageClick: (src: string) => void;
   }

   const WEB_OF_WYRD_1 = `${import.meta.env.BASE_URL}webofwyrd1.png`;
   const WEB_OF_WYRD_2 = `${import.meta.env.BASE_URL}webofwyrd2.png`;

   /** Tab "Mạng lưới định mệnh (Wyrd)": nội dung tĩnh + 2 ảnh Web of Wyrd có thể phóng to. */
   function WyrdTab({ onImageClick }: WyrdTabProps) {
     return (
       <article className="rune-card prose">
         <h2 className="prose-title">Mạng lưới định mệnh (Wyrd)</h2>
         <p className="prose-lead">
           <strong>Mạng lưới Wyrd</strong> biểu trưng cho bản chất liên kết chặt chẽ của vạn vật – giữa quá khứ, hiện tại và tương lai. Đây chính là tấm thảm định mệnh được ba vị nữ thần Norn dệt nên dưới rễ cây thế giới, nơi mỗi hành vi đơn lẻ đều tạo ra những gợn sóng lan tỏa khắp không gian và thời gian.
         </p>
         <section className="prose-section">
           <h3 className="prose-heading">Ba nữ thần số mệnh (Norn)</h3>
           <p className="prose-text">
             <strong>Urd (Quá khứ)</strong> – Người cai quản những gì đã qua, đại diện cho những sợi chỉ đã dệt cố định vào lòng thực tại.<br />
             <strong>Verdandi (Hiện tại)</strong> – Người biểu thị cho những gì đang diễn ra, khoảnh khắc của sự kiến tạo và quyền chủ động lựa chọn.<br />
             <strong>Skuld (Tương lai)</strong> – Người nắm giữ những gì sẽ đến, đại diện cho tiềm năng và những hệ quả nối tiếp từ quá khứ.
           </p>
         </section>
         <section className="prose-section">
           <h3 className="prose-heading">Cửu giới</h3>
           <p className="prose-text">
             Mạng lưới định mệnh kết nối trọn vẹn cả chín cõi giới trong vũ trụ quan thần thoại Bắc Âu, từ đỉnh Asgard linh thiêng đến vực sâu Hel tối tăm. Mỗi thế giới đều tác động qua lại lẫn nhau, và những sợi chỉ của Wyrd buộc chặt chúng lại trong vũ điệu nhân quả vĩnh cửu.
           </p>
         </section>
         <section className="prose-section">
           <h3 className="prose-heading">Hiểu về Wyrd</h3>
           <p className="prose-text">
             Wyrd không đơn thuần là số phận hay định mệnh an bài cố định, mà là một hệ thống mạng lưới phức tạp đan xen giữa các mối quan hệ, những quyết định và hệ quả định hình nên cuộc đời ta. Mỗi lựa chọn ta đưa ra đều tác động tới mô thức chung, và mỗi hành động đều lan tỏa chạm đến vạn vật xung quanh. Quá khứ ảnh hưởng tới hiện tại, hiện tại tạo hình tương lai, nhưng sâu thẳm bên trong, ta luôn giữ quyền tự do để chọn cách bước đi trên con đường của chính mình.
           </p>
         </section>
         <div className="figure-row">
           <ZoomableImage src={WEB_OF_WYRD_1} alt="Biểu tượng Web of Wyrd, mẫu 1" className="figure-img--square" onOpen={onImageClick} />
           <ZoomableImage src={WEB_OF_WYRD_2} alt="Biểu tượng Web of Wyrd, mẫu 2" className="figure-img--square" onOpen={onImageClick} />
         </div>
         <section className="prose-section">
           <h3 className="prose-heading">Biểu tượng</h3>
           <p className="prose-text">
             Toàn bộ 24 Rune Elder Futhark đều có thể được tìm thấy trong Mạng lưới Wyrd. Khi học rune, ta cũng đang đọc các mô thức của chính Wyrd. Rune không tách khỏi Lưới, mà là một phần của nó được biểu hiện thành ký hiệu. Khi bạn rút rune hoặc làm việc với chúng, bạn đang chạm vào các sợi Wyrd. Mỗi rune mang một phần trí tuệ của Lưới và có thể hé lộ cách quá khứ, hiện tại, tương lai đan vào đời sống của bạn.
           </p>
         </section>
       </article>
     );
   }

   export default WyrdTab;
   ```
6. `HistoryTab.tsx` thành:
   ```tsx
   /** Tab "Lịch sử Rune": nội dung tĩnh, không cần props. */
   function HistoryTab() {
     return (
       <article className="rune-card prose">
         <h2 className="prose-title">Lịch Sử Của Hệ Thống Chữ Rune Cổ</h2>
         <p className="prose-quote">
           "Chín đêm dài ta treo mình trên cây gió cuốn, bị giáo đâm, dâng tới Odin, chính ta dâng mình cho chính ta..."
         </p>
         <p className="prose-text">
           Ẩn khuất trong làn sương mù thần thoại Bắc Âu, trước khi thế giới hình thành, chữ Rune vốn đã ẩn chứa vô vàn bí ẩn, luồn sâu vào cấu trúc tồn tại của thế giới. Ngay cả chư thần thuở sơ khai cũng không thể thấu thị được hết quyền năng ẩn giấu của chúng. Chính Odin - Phụ Thần tối cao, là người khao khát có được tri thức vĩ đại ấy hơn hết thảy.
         </p>
         <p className="prose-text">
           Ngài đã tự hiến tế, treo mình trên Cây Thế Giới Yggdrasil suốt chín ngày chín đêm ròng rã. Thân xác Ngài bị đâm xuyên bởi chính ngọn giáo thần Gungnir, chịu đựng trạng thái không ăn, không uống, cô độc chống chọi với cuồng phong bão tuyết. Trong khoảnh khắc cận kề lằn ranh sinh tử, khi nhìn sâu xuống giếng thiêng Urd - nơi các Norn dệt thảm định mệnh, những cổ tự Rune quyền năng đã tự hiện hình và khải huyền sức mạnh, ma thuật và vận mệnh của chúng cho ông.
         </p>
       </article>
     );
   }

   export default HistoryTab;
   ```
7. `ImageLightbox.tsx` thành:
   ```tsx
   interface ImageLightboxProps {
     src: string | null;
     onClose: () => void;
   }

   /** Modal phóng to ảnh — không render gì nếu `src` là null. Nút đóng tự nhận focus. */
   function ImageLightbox({ src, onClose }: ImageLightboxProps) {
     if (!src) return null;

     return (
       <div role="dialog" aria-modal="true" aria-label="Ảnh phóng to" className="lightbox" onClick={onClose}>
         <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
           <button type="button" className="btn btn-ghost lightbox-close" onClick={onClose} aria-label="Đóng ảnh phóng to" autoFocus>
             ✕
           </button>
           <img src={src} alt="Ảnh phóng to" className="figure-img lightbox-img" />
         </div>
       </div>
     );
   }

   export default ImageLightbox;
   ```
8. `npx vitest run src/App.test.tsx` → **PASS**.
9. Commit: `Restyle static tabs and make illustrations keyboard-zoomable`

## Task 4 — Từ điển + chú thích

**Modify**: `src/components/tabs/DictionaryTab.tsx`, `src/components/RuneAnnotations.tsx`

1. `DictionaryTab.tsx` thành:
   ```tsx
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
   ```
2. `RuneAnnotations.tsx`, phần `return` thành:
   ```tsx
     return (
       <div className="rune-annotations">
         {rune.annotations.map((ann, idx) => (
           <span key={idx} className="tag rune-tooltip">
             {ann.word}
             <span className="tooltip-content">
               <strong className="tooltip-title">{ann.translated}</strong>
               <span className="tooltip-text">{ann.historyNote}</span>
             </span>
           </span>
         ))}
       </div>
     );
   ```
3. `npm test` → PASS.
4. Commit: `Restyle dictionary cards and annotation tags`

## Task 5 — Lá bài + hạt sáng

**Modify**: `src/components/FlipCard.tsx`, `src/components/StarMist.tsx`

1. Trong `FlipCard.tsx`, thay toàn bộ khối từ `{/* MẶT TRƯỚC` đến hết thẻ đóng của `flip-card-back`
   bằng:
   ```tsx
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
             <span className="flip-card-mark" aria-hidden="true">?</span>
             <h3 className="flip-card-veil">Ẩn tự</h3>
             <p className="flip-card-hint">Chạm để lật mở</p>
           </div>

           {/* MẶT SAU: ký hiệu (xoay 180° nếu ngược), ý nghĩa, mô tả và lời khuyên cuộn được */}
           <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
             <div className="flip-card-position">{position}</div>
             <span className="rune-symbol" style={isReversed ? { transform: 'rotate(180deg)' } : undefined}>
               {rune.symbol}
             </span>
             <h3 className="rune-name">{rune.name}{isReversed ? ' (Ngược)' : ''}</h3>
             <p className="rune-meaning">{isReversed && rune.reversedMeaning ? rune.reversedMeaning : rune.meaning}</p>

             <RuneAnnotations rune={rune} />

             <div className="flip-card-scroll-zone">
               <p className="flip-card-description">{rune.description}</p>
               <p className="flip-card-advice">{adviceText}</p>
             </div>
           </div>
   ```
2. `StarMist.tsx`: đổi `` ctx.fillStyle = `rgba(136, 192, 208, ${p.a})`; `` thành
   `` ctx.fillStyle = `rgba(216, 176, 106, ${p.a})`; ``.
3. `npm test` → PASS.
4. Commit: `Restyle flip cards and star mist in amber tones`

## Task 6 — Viết tên

**Modify**: `src/components/tabs/NameWriterTab.tsx`

1. Đổi `className="name-writer-input"` thành `className="input name-writer-input"` và
   `className="name-writer-copy"` thành `className="btn name-writer-copy"`.
2. `npx vitest run src/components/tabs/NameWriterTab.test.tsx` → PASS.
3. Commit: `Use shared input and button styles in name writer`

## Task 7 — Tab Tiên đoán: chỉ đổi màu

**Modify**: `src/components/RandomPullTab.tsx` — không đổi cấu trúc, chỉ thay giá trị:

| Tìm (xuất hiện ở) | Thay bằng |
|---|---|
| `'linear-gradient(145deg, #2c3e50, #1a252f)' : 'linear-gradient(145deg, #1a1d24, #0e1117)'` (2 nút nhóm) | `'var(--accent-soft)' : 'var(--surface)'` |
| `color: '#e8f4fd', border: horizontalRuneCount === count ? '1px solid #63b3ed' : '1px solid rgba(99, 179, 237, 0.2)'` (2) | `color: 'var(--text)', border: horizontalRuneCount === count ? '1px solid var(--accent)' : '1px solid var(--line)'` |
| `borderRadius: '8px', padding: '0.6rem 1rem'` (2) | `borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem'` |
| `flex: 2, background: 'linear-gradient(145deg, #181c24, #0a0d12)',` | `flex: 2, background: 'var(--surface)',` |
| `border: '1px solid rgba(99, 179, 237, 0.15)', borderRadius: '12px',` | `border: '1px solid var(--line)', borderRadius: 'var(--radius)',` |
| `boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'` | `boxShadow: 'var(--shadow)'` |
| `color: '#e8f4fd', fontSize: '1.1rem', letterSpacing: '0.05em'` (label) | `color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '0.05em'` |
| style của `<textarea>` (cả object) | `className="input"` + `style={{ resize: 'none', minHeight: '52px', fontSize: '0.95rem', lineHeight: 1.4 }}` |
| `color: '#b8d4e6'` (dòng prompt) | `color: 'var(--text-muted)'` |
| nút "Tiên đoán": `className="pull-button" style={{…}}` | `className="btn" style={{ marginTop: '0.2rem' }}` |
| nút "Bắt đầu lại": `className="pull-button" style={{…}}` | `className="btn btn-ghost" style={{ marginTop: '0.2rem' }}` |

1. Áp các thay thế trên.
2. `grep -nE "#[0-9a-fA-F]{3,6}\b|rgba\(" src/components/RandomPullTab.tsx` → không còn dòng nào.
3. `npm test` → PASS.
4. Commit: `Map divination tab colors onto theme tokens`

## Task 8 — Kiểm tra tổng thể

1. `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` → đều sạch.
2. `grep -rnE "textAlign: ?'justify'|text-align: ?justify" src` → không có.
3. `grep -rnE "#[0-9a-fA-F]{3,6}\b" src --include=*.tsx` → không có.
4. `grep -rn "style={{" src --include=*.tsx | grep -v RandomPullTab` → chỉ còn
   `animationDelay` (Từ điển).
5. `vite preview`, dùng script Playwright: chụp mọi tab ở 1440px và 375px; đo
   `scrollWidth - innerWidth` = 0 ở 375, 1025, 1280, 1440px; console không lỗi ngoài 404 favicon
   (đã có từ trước); mở menu mobile, chụp; mở ảnh phóng to bằng Enter, chụp.
6. Xem ảnh chụp, sửa chỗ lệch (nếu có) rồi commit riêng.

---

## Phụ lục A — `src/index.css` hoàn chỉnh

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Runic&display=swap');

/* ============================================================
   Design tokens — giao diện "Đá cổ". Mọi màu, bo góc, font chỉ dùng qua các biến này.
   ============================================================ */
:root {
  --bg-deep: #110e0b;
  --bg-glow: #2a2219;
  --surface-1: #211b15;
  --surface-2: #17130f;
  --surface: linear-gradient(160deg, var(--surface-1), var(--surface-2));
  --inset: #120f0c;
  --band: rgba(17, 14, 11, 0.8);
  --overlay: rgba(10, 8, 6, 0.92);
  --line: rgba(212, 169, 96, 0.22);
  --line-strong: rgba(212, 169, 96, 0.5);
  --text: #f0e7d8;
  --text-body: #d8ccba;
  --text-muted: #a59680;
  --accent: #d8b06a;
  --accent-bright: #ecd3a2;
  --accent-soft: rgba(216, 176, 106, 0.13);
  --accent-hover: rgba(216, 176, 106, 0.2);
  --accent-glow: rgba(216, 176, 106, 0.65);
  --warn: #d99a7a;
  --stripes: repeating-linear-gradient(45deg, rgba(216, 176, 106, 0.035) 0 8px, transparent 8px 16px);
  --shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  --radius: 6px;
  --radius-sm: 4px;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Inter', sans-serif;
  --font-rune: 'Noto Sans Runic', 'Cormorant Garamond', serif;
  --rune-glow: 0 2px 0 rgba(0, 0, 0, 0.8), 0 0 16px rgba(216, 176, 106, 0.35);

  font-family: var(--font-body);
  line-height: 1.6;
  font-weight: 400;
  color-scheme: dark;
  color: var(--text);
  background: var(--bg-deep);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

/* ============================================================
   Nền tảng
   ============================================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  background: radial-gradient(ellipse 80% 50% at 50% 0%, var(--bg-glow) 0%, var(--bg-deep) 70%) fixed;
  background-color: var(--bg-deep);
  color: var(--text);
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem 3rem;
}

/* ============================================================
   Thanh trên cùng + menu
   ============================================================ */
.top-band {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--band);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.top-band-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  padding: 0.75rem 2rem;
}

.app-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text);
  white-space: nowrap;
}

.top-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0 1.75rem;
}

.nav-tab {
  position: relative;
  min-height: 44px;
  padding: 0 0.1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-tab:hover {
  color: var(--text);
}

.nav-tab.active {
  color: var(--accent);
}

.nav-tab.active::after {
  content: '◆';
  position: absolute;
  left: 50%;
  bottom: 3px;
  transform: translateX(-50%);
  font-size: 7px;
  line-height: 1;
  color: var(--accent);
}

.menu-toggle {
  min-height: 40px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
}

.top-nav.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem 1rem;
  background: var(--surface-2);
  border-bottom: 1px solid var(--line);
  box-shadow: var(--shadow);
}

/* ============================================================
   Thành phần dùng chung
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.75rem 2rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent-bright);
  background: var(--accent-soft);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn:hover {
  background: var(--accent-hover);
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--text-muted);
}

.btn-ghost:hover {
  background: transparent;
  border-color: var(--line-strong);
  color: var(--text);
}

.btn:focus-visible,
.nav-tab:focus-visible,
.figure-img:focus-visible,
.flip-card-front:focus-visible,
.name-writer-mode:focus-visible,
.name-writer-rune:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text);
  background: var(--inset);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.2s ease;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  border-color: var(--line-strong);
}

.tag {
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-sm);
}

.panel,
.rune-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.rune-card {
  padding: 2.5rem;
  text-align: center;
  box-shadow: var(--shadow);
}

.rune-symbol,
.rune-glyph {
  font-family: var(--font-rune);
  color: var(--accent-bright);
  text-shadow: var(--rune-glow);
  line-height: 1;
}

.rune-symbol {
  display: block;
  font-size: 4.5rem;
  margin-bottom: 1rem;
}

.rune-name {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text);
}

.rune-meaning {
  font-weight: 500;
  color: var(--accent);
}

/* ============================================================
   Trang nội dung tĩnh (Bindrunes, Wyrd, Lịch sử) + ảnh minh họa
   ============================================================ */
.prose {
  max-width: 800px;
  margin: 0 auto;
}

.prose-title {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.prose-lead {
  color: var(--text-body);
  line-height: 1.65;
  margin-bottom: 2rem;
}

.prose-section {
  text-align: left;
  margin-bottom: 2rem;
}

.prose-heading {
  font-size: 1.45rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.prose-text {
  text-align: left;
  color: var(--text-body);
  line-height: 1.7;
}

.prose-text + .prose-text {
  margin-top: 1.25rem;
}

.prose-quote {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.3rem;
  color: var(--accent);
  margin-bottom: 2rem;
}

.prose-closing {
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
}

.figure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.figure {
  padding: 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.figure-title {
  font-size: 1.3rem;
  color: var(--text);
  margin: 0.75rem 0 0.25rem;
}

.figure-subtitle {
  font-size: 0.9rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.figure-caption {
  text-align: left;
  font-size: 0.9rem;
  font-style: italic;
  line-height: 1.6;
  color: var(--text-body);
}

.figure-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Ảnh gốc là nét đen trên nền trắng: đảo màu + nhuộm hổ phách, nền đen hòa vào thẻ tối. */
.figure-img {
  display: block;
  max-width: 150px;
  height: auto;
  margin: 0 auto;
  cursor: zoom-in;
  border-radius: var(--radius-sm);
  filter: invert(1) sepia(1) saturate(1.6) hue-rotate(-10deg) brightness(0.95);
  mix-blend-mode: screen;
}

.figure-img--square {
  width: 180px;
  height: 180px;
  max-width: none;
  margin: 0;
  object-fit: contain;
}

/* ============================================================
   Khung phóng to ảnh
   ============================================================ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem 1rem;
  background: var(--overlay);
  backdrop-filter: blur(8px);
}

.lightbox-frame {
  position: relative;
  max-width: min(95vw, 900px);
  padding: 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.lightbox-img {
  max-width: 100%;
  max-height: calc(85vh - 3rem);
  object-fit: contain;
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: -2.75rem;
  right: 0;
  width: 2.25rem;
  min-height: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border-radius: 50%;
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0;
}

/* ============================================================
   Từ điển
   ============================================================ */
.search-wrap {
  max-width: 500px;
  margin: 0 auto 2rem;
}

.rune-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dictionary-card {
  padding: 1.75rem 1.5rem;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: border-color 0.2s ease;
}

.dictionary-card:hover {
  border-color: var(--line-strong);
}

.dictionary-card .rune-symbol {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.dictionary-card .rune-name {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.dictionary-card .rune-meaning {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.rune-reversed {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.rune-description {
  text-align: left;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-body);
}

/* ============================================================
   Tag chú thích + tooltip
   ============================================================ */
.rune-annotations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.rune-tooltip {
  position: relative;
  cursor: help;
  border-bottom: 1px dotted var(--accent);
  transition: background 0.2s ease, color 0.2s ease;
}

.rune-tooltip:hover {
  color: var(--text);
  background: var(--accent-hover);
}

.rune-tooltip .tooltip-content {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  z-index: 9999;
  top: 140%;
  left: 50%;
  width: 250px;
  padding: 0.8rem;
  text-align: left;
  color: var(--text-body);
  background: var(--surface-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transform: translateX(-50%);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rune-tooltip .tooltip-content::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-bottom-color: var(--surface-2);
}

.rune-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(2px);
}

.tooltip-title {
  display: block;
  margin-bottom: 0.2rem;
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--accent);
}

.tooltip-text {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
  line-height: 1.4;
}

/* ============================================================
   Lá bài lật 3D
   ============================================================ */
.flip-card-container {
  position: relative;
  perspective: 1000px;
  width: 100%;
  max-width: 230px;
  height: 440px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.flip-card-container.is-revealed .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  justify-content: center;
  cursor: pointer;
  background: var(--stripes), var(--surface);
  transition: border-color 0.2s ease;
}

.flip-card-front:hover {
  border-color: var(--line-strong);
}

.flip-card-back {
  justify-content: flex-start;
  background: var(--surface);
  transform: rotateY(180deg);
}

.flip-card-mark {
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--text-muted);
  opacity: 0.45;
  margin-bottom: 0.75rem;
}

.flip-card-veil {
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  opacity: 0.6;
  margin-bottom: 0.4rem;
}

.flip-card-hint {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-muted);
}

.flip-card-position {
  margin-bottom: 0.5rem;
  padding: 0.2rem 0.7rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.flip-card-back .rune-symbol {
  display: inline-block;
  font-size: 2.8rem;
  margin: 0.25rem 0 0.4rem;
}

.flip-card-back .rune-name {
  font-size: 1.15rem;
  margin-bottom: 0.15rem;
}

.flip-card-back .rune-meaning {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.flip-card-scroll-zone {
  flex: 1;
  width: 100%;
  margin-top: 0.25rem;
  padding-right: 2px;
  overflow-y: auto;
}

.flip-card-scroll-zone::-webkit-scrollbar {
  width: 3px;
}

.flip-card-scroll-zone::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: 999px;
}

.flip-card-description {
  text-align: left;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--text-body);
  margin-bottom: 0.5rem;
}

.flip-card-advice {
  text-align: left;
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--text);
  padding-top: 0.5rem;
  border-top: 1px solid var(--line);
}

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

/* ============================================================
   Hiệu ứng "Cộng Hưởng" — vòng sáng lan tỏa 1 lần khi FlipCard lộ kết quả.
   ============================================================ */
.resonance {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.resonance-ring {
  position: absolute;
  width: 70%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid var(--accent-glow);
  box-shadow: 0 0 12px var(--accent-soft);
  opacity: 0;
  animation: resonance-pulse 1.3s ease-out forwards;
}

.resonance-ring--delay-1 { animation-delay: 0.18s; }
.resonance-ring--delay-2 { animation-delay: 0.36s; }

@keyframes resonance-pulse {
  0% { opacity: 0.9; transform: scale(0.35); }
  100% { opacity: 0; transform: scale(1.9); }
}

.flip-card-container.is-revealed .flip-card-back {
  animation: resonance-glow 1.3s ease-out;
}

@keyframes resonance-glow {
  0% {
    box-shadow: var(--shadow);
    border-color: var(--line);
  }
  35% {
    box-shadow: var(--shadow), 0 0 45px var(--accent-glow);
    border-color: var(--accent);
  }
  100% {
    box-shadow: var(--shadow);
    border-color: var(--line);
  }
}

@media (prefers-reduced-motion: reduce) {
  .weave-in {
    animation: none;
  }

  .resonance-ring,
  .flip-card-container.is-revealed .flip-card-back {
    animation: none;
  }

  .resonance-ring {
    opacity: 0;
  }
}

/* ============================================================
   Viết tên bằng Rune
   ============================================================ */
.name-writer {
  max-width: 800px;
  margin: 0 auto;
}

.name-writer-title {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1rem;
}

.name-writer-intro {
  color: var(--text-body);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.name-writer-input {
  max-width: 420px;
  font-size: 1.1rem;
  text-align: center;
}

.name-writer-modes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0 0.4rem;
}

.name-writer-mode {
  min-height: 36px;
  padding: 0.4rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-body);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.name-writer-mode:hover {
  color: var(--text);
  border-color: var(--line-strong);
}

.name-writer-mode.active {
  color: var(--text);
  background: var(--accent-soft);
  border-color: var(--accent);
}

.name-writer-hint,
.name-writer-empty {
  font-size: 0.88rem;
  font-style: italic;
  color: var(--text-muted);
}

.name-writer-output {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.15rem;
  min-height: 4rem;
  margin: 1.75rem 0 1rem;
}

.name-writer-rune {
  padding: 0.2rem 0.35rem;
  font-family: var(--font-rune);
  font-size: 3rem;
  line-height: 1;
  color: var(--accent-bright);
  text-shadow: var(--rune-glow);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.name-writer-rune:hover,
.name-writer-rune.active {
  border-color: var(--line-strong);
  background: var(--accent-soft);
}

.name-writer-separator {
  margin: 0 0.4rem;
  font-family: var(--font-rune);
  font-size: 2rem;
  color: var(--accent);
  opacity: 0.7;
}

.name-writer-detail {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;
  text-align: left;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.name-writer-detail-symbol {
  font-family: var(--font-rune);
  font-size: 2.5rem;
  color: var(--accent-bright);
  text-shadow: var(--rune-glow);
}

.name-writer-detail h3 {
  margin-bottom: 0.2rem;
  font-size: 1.3rem;
  color: var(--text);
}

.name-writer-detail p {
  font-size: 0.95rem;
  color: var(--text-body);
}

.name-writer-detail .name-writer-detail-source {
  margin-top: 0.2rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-muted);
}

.name-writer-skipped,
.name-writer-copy-error {
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--warn);
}

.name-writer-copy {
  display: flex;
  width: fit-content;
  margin: 0 auto 1rem;
}

.name-writer-note {
  margin-top: 2rem;
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.6;
  color: var(--text-muted);
}

/* ============================================================
   Màn hình hẹp
   ============================================================ */
@media (max-width: 1024px) {
  .top-band-content {
    flex-wrap: nowrap;
    padding: 0.6rem 1rem;
  }

  .app-title {
    font-size: 1.25rem;
    letter-spacing: 0.16em;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem 1rem 2rem;
  }

  .rune-card {
    padding: 1.5rem 1rem;
  }

  .prose-title,
  .name-writer-title {
    font-size: 1.6rem;
  }

  .rune-grid {
    grid-template-columns: 1fr;
  }

  .name-writer-rune {
    font-size: 2.4rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.05rem;
    letter-spacing: 0.1em;
  }
}
```
