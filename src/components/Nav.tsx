import { TabId } from '../types';

interface NavItem {
  id: TabId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'randompull', label: 'Tiên đoán' },
  { id: 'namewriter', label: 'Viết tên' },
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
