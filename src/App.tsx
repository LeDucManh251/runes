import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import ImageLightbox from './components/ImageLightbox';
import RandomPullTab from './components/RandomPullTab';
import DictionaryTab from './components/tabs/DictionaryTab';
import NameWriterTab from './components/tabs/NameWriterTab';
import BindrunesTab from './components/tabs/BindrunesTab';
import WyrdTab from './components/tabs/WyrdTab';
import HistoryTab from './components/tabs/HistoryTab';
import { TabId } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('randompull');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="top-band" ref={topBandRef}>
        <div className="top-band-content">
          <h1 className="app-title">Rune Elder Futhark</h1>
          <Nav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      <div className="container">
        <div key={activeTab} className="tab-content weave-in">
          {activeTab === 'dictionary' && <DictionaryTab />}
          {activeTab === 'randompull' && <RandomPullTab isMobile={isMobile} />}
          {activeTab === 'namewriter' && <NameWriterTab />}
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
