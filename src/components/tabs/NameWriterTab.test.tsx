import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRuneById } from '../../data/runes';
import NameWriterTab from './NameWriterTab';

const typeName = (value: string) => {
  fireEvent.change(screen.getByLabelText('Tên cần viết bằng rune'), { target: { value } });
};

const runeButtons = () => screen.queryAllByRole('button', { name: /, từ "/ });

describe('NameWriterTab', () => {
  it('ô trống thì hiện ví dụ, chưa có rune', () => {
    render(<NameWriterTab />);
    expect(screen.getByText('Ví dụ: Minh Anh')).toBeInTheDocument();
    expect(runeButtons()).toHaveLength(0);
  });

  it('gõ "Minh" hiện rune theo âm tiếng Việt (mặc định)', () => {
    render(<NameWriterTab />);
    typeName('Minh');
    expect(runeButtons().map((button) => button.textContent)).toEqual(['ᛗ', 'ᛁ', 'ᛜ']);
  });

  it('đổi sang "Theo chữ cái" thì kết quả đổi theo', () => {
    render(<NameWriterTab />);
    typeName('Minh');
    fireEvent.click(screen.getByRole('button', { name: 'Theo chữ cái' }));
    expect(runeButtons().map((button) => button.textContent)).toEqual(['ᛗ', 'ᛁ', 'ᚾ', 'ᚺ']);
  });

  it('bấm một rune thì hiện tên, ý nghĩa và chữ gốc; bấm lại thì đóng', () => {
    const mannaz = getRuneById('mannaz')!;
    render(<NameWriterTab />);
    typeName('Minh');
    fireEvent.click(runeButtons()[0]);
    expect(screen.getByRole('heading', { name: mannaz.name })).toBeInTheDocument();
    expect(screen.getByText(mannaz.meaning)).toBeInTheDocument();
    expect(screen.getByText('Phiên từ: m')).toBeInTheDocument();
    fireEvent.click(runeButtons()[0]);
    expect(screen.queryByRole('heading', { name: mannaz.name })).not.toBeInTheDocument();
  });

  it('ký tự không có rune thì báo đã bỏ qua', () => {
    render(<NameWriterTab />);
    typeName('Minh 2!');
    expect(screen.getByText('Không có rune tương ứng, đã bỏ qua: 2, !')).toBeInTheDocument();
  });
});
