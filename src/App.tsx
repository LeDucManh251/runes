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
