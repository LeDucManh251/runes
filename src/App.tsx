import { useState, useEffect } from 'react';
import { runes } from './data/runes';
import RandomPullTab from './components/RandomPullTab';
import RuneAnnotations from './components/RuneAnnotations';

function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'bindrunes' | 'wyrd' | 'randompull' | 'history'>('randompull');
  const [dictionarySearch, setDictionarySearch] = useState('');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Hệ thống responsive & Trạng thái UI
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

  // Đóng modal phóng to ảnh bằng phím Escape
  useEffect(() => {
    if (!enlargedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnlargedImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedImage]);

  const handleTabChange = (tab: 'dictionary' | 'bindrunes' | 'wyrd' | 'randompull' | 'history') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const filteredRunes = runes.filter(rune =>
    rune.name.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    rune.meaning.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    rune.description.toLowerCase().includes(dictionarySearch.toLowerCase())
  );

  return (
    <>
      <div className="top-band">
        <div className="top-band-content">
          <h1 className="app-title" style={{ letterSpacing: '0.12em', textShadow: '0 0 15px rgba(232,244,253,0.3)', fontSize: '2rem' }}>Rune Elder Futhark</h1>

          {isMobile ? (
            <>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                  <button className={`nav-button ${activeTab === 'randompull' ? 'active' : ''}`} onClick={() => handleTabChange('randompull')}>Tiên đoán</button>
                  <button className={`nav-button ${activeTab === 'dictionary' ? 'active' : ''}`} onClick={() => handleTabChange('dictionary')}>Từ điển Rune</button>
                  <button className={`nav-button ${activeTab === 'bindrunes' ? 'active' : ''}`} onClick={() => handleTabChange('bindrunes')}>Bindrunes</button>
                  <button className={`nav-button ${activeTab === 'wyrd' ? 'active' : ''}`} onClick={() => handleTabChange('wyrd')}>Mạng lưới định mệnh (Wyrd)</button>
                  <button className={`nav-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')}>Lịch sử Rune</button>
                </nav>
              )}
            </>
          ) : (
            <nav className="top-nav">
              <button className={`nav-button ${activeTab === 'randompull' ? 'active' : ''}`} onClick={() => handleTabChange('randompull')}>Tiên đoán</button>
              <button className={`nav-button ${activeTab === 'dictionary' ? 'active' : ''}`} onClick={() => handleTabChange('dictionary')}>Từ điển Rune</button>
              <button className={`nav-button ${activeTab === 'bindrunes' ? 'active' : ''}`} onClick={() => handleTabChange('bindrunes')}>Bindrunes</button>
              <button className={`nav-button ${activeTab === 'wyrd' ? 'active' : ''}`} onClick={() => handleTabChange('wyrd')}>Mạng lưới định mệnh (Wyrd)</button>
              <button className={`nav-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')}>Lịch sử Rune</button>
            </nav>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem' }}>

      {/* TAB TỪ ĐIỂN RUNE GỐC NỀN XÁM LẠNH ĐẬM CHẤT BẮC ÂU */}
      {activeTab === 'dictionary' && (
        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={dictionarySearch}
                onChange={(e) => setDictionarySearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(145deg, #1a1d26, #0e1117)',
                  border: '1px solid rgba(99, 179, 237, 0.3)', borderRadius: '8px', color: '#e8f4fd',
                  fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div className="rune-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {filteredRunes.map((rune) => (
              <div key={rune.id} className="dictionary-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
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
      )}

      {activeTab === 'randompull' && <RandomPullTab isMobile={isMobile} />}

      {/* CÁC TAB NỘI DUNG VĂN BẢN TRUYỀN THỐNG KHÁC GIỮ NGUYÊN HOÀN CHỈNH */}
      {activeTab === 'bindrunes' && (
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
              <img src={`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`} alt="Bindrune ghép Thurisaz và Raidho" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`)} />
              <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Thurisaz + Raidho</h4>
              <p style={{ fontSize: '0.9rem', color: '#63b3ed', marginBottom: '0.5rem' }}>Protection + Journey</p>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e0', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'justify' }}>
                Sự kết hợp giữa lá chắn phòng thủ kiên cố của Thurisaz và sự định hướng luân chuyển trôi chảy của Raidho. Mật chú này thường dùng cầu bình an, bảo hộ chủ nhân vững bước trên mọi chuyến đi xa hoặc các bước chuyển mình lớn của tâm thức.
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #1b202e, #0e111a)', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.2)' }}>
              <img src={`${import.meta.env.BASE_URL}bindruneingwazothala1.png`} alt="Bindrune ghép Ingwaz và Othala" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}bindruneingwazothala1.png`)} />
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
      )}

      {activeTab === 'wyrd' && (
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
            <img src={`${import.meta.env.BASE_URL}webofwyrd1.png`} alt="Web of Wyrd 1" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}webofwyrd1.png`)} />
            <img src={`${import.meta.env.BASE_URL}webofwyrd2.png`} alt="Web of Wyrd 2" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}webofwyrd2.png`)} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>BIỂU TƯỢNG</h3>
            <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
              Toàn bộ 24 Rune Elder Futhark đều có thể được tìm thấy trong Mạng lưới Wyrd. Khi học rune, ta cũng đang đọc các mô thức của chính Wyrd. Rune không tách khỏi Lưới, mà là một phần của nó được biểu hiện thành ký hiệu. Khi bạn rút rune hoặc làm việc với chúng, bạn đang chạm vào các sợi Wyrd. Mỗi rune mang một phần trí tuệ của Lưới và có thể hé lộ cách quá khứ, hiện tại, tương lai đan vào đời sống của bạn.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
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
      )}

      {/* Modal phóng to ảnh */}
      {enlargedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh phóng to"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5, 7, 10, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}
          onClick={closeEnlargedImage}
        >
          <div style={{ position: 'relative', maxWidth: 'min(95vw, 1600px)', maxHeight: 'min(95vh, 1000px)' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEnlargedImage}
              aria-label="Đóng ảnh phóng to"
              style={{
                position: 'absolute', top: '-2.5rem', right: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '999px', color: '#e8f4fd', width: '2rem', height: '2rem', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1
              }}
            >
              ✕
            </button>
            <img src={enlargedImage} alt="Ảnh phóng to" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.3)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)' }} />
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default App;
