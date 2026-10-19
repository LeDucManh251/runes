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
