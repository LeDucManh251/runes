import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    // jsdom mặc định innerWidth = 1024, trùng đúng ranh giới breakpoint mobile
    // (`window.innerWidth <= 1024`) của App.tsx, khiến App tự chuyển sang layout
    // mobile (ẩn nav) ngay khi mount. Ép về độ rộng desktop để test phản ánh
    // đúng trạng thái mặc định như trên màn hình lớn.
    window.innerWidth = 1280;
  });

  it('hiển thị tiêu đề và mặc định chọn tab Tiên đoán', () => {
    render(<App />);
    expect(screen.getByText('Rune Elder Futhark')).toBeInTheDocument();
    // Scope vào <nav> vì nút "Tiên đoán" trong nav và nút "Tiên đoán" (pull-button)
    // của RandomPullTab có cùng tên hiển thị/accessible name.
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByRole('button', { name: 'Tiên đoán' })).toHaveClass('active');
    expect(within(nav).getByRole('button', { name: 'Viết tên' })).toBeInTheDocument();
  });
});
