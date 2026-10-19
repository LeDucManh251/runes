import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RandomPullTab from './RandomPullTab';

const questionInput = () => screen.queryByLabelText('Câu hỏi của bạn');
const cardFronts = () => screen.queryAllByRole('button', { name: /Lật mở lá bài ẩn/ });
const questionBar = () => screen.getByRole('region', { name: 'Câu hỏi của lượt rút' });

const drawWith = (question: string, spreadName: RegExp) => {
  fireEvent.change(questionInput()!, { target: { value: question } });
  fireEvent.click(screen.getByRole('button', { name: spreadName }));
  fireEvent.click(screen.getByRole('button', { name: 'Tiên đoán' }));
};

describe('RandomPullTab', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('bước 1 có tiêu đề, 5 gợi ý, 4 kiểu trải bài và chưa có lá nào', () => {
    render(<RandomPullTab isMobile={false} />);
    expect(screen.getByRole('heading', { name: 'Điều gì đang ở trong tâm trí bạn?' })).toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Gợi ý câu hỏi' })).getAllByRole('button')).toHaveLength(5);
    expect(within(screen.getByRole('group', { name: 'Kiểu trải bài' })).getAllByRole('button')).toHaveLength(4);
    expect(cardFronts()).toHaveLength(0);
  });

  it('bấm gợi ý thì điền đúng chữ đó vào ô câu hỏi', () => {
    render(<RandomPullTab isMobile={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Một mối quan hệ' }));
    expect(questionInput()).toHaveValue('Một mối quan hệ');
  });

  it('rút 3 lá: thu thành dải câu hỏi và hiện 3 lá úp', () => {
    render(<RandomPullTab isMobile={false} />);
    drawWith('Công việc sắp tới', /^3 lá/);
    expect(questionInput()).not.toBeInTheDocument();
    expect(within(questionBar()).getByText('“Công việc sắp tới”')).toBeInTheDocument();
    expect(within(questionBar()).getByText('3 lá · đã lật 0/3')).toBeInTheDocument();
    expect(cardFronts()).toHaveLength(3);
  });

  it('lật một lá thì dải cập nhật số lá đã lật', () => {
    render(<RandomPullTab isMobile={false} />);
    drawWith('Công việc sắp tới', /^3 lá/);
    fireEvent.click(cardFronts()[0]);
    expect(within(questionBar()).getByText('3 lá · đã lật 1/3')).toBeInTheDocument();
  });

  it('câu hỏi trống thì dải ghi "Không đặt câu hỏi cụ thể"', () => {
    render(<RandomPullTab isMobile={false} />);
    drawWith('   ', /^1 lá/);
    expect(within(questionBar()).getByText('Không đặt câu hỏi cụ thể')).toBeInTheDocument();
  });

  it('"Hỏi câu khác" quay về bước 1, giữ câu hỏi và kiểu trải bài', () => {
    render(<RandomPullTab isMobile={false} />);
    drawWith('Chuyện tiền bạc', /^5 lá/);
    fireEvent.click(within(questionBar()).getByRole('button', { name: /Hỏi câu khác/ }));
    expect(questionInput()).toHaveValue('Chuyện tiền bạc');
    expect(screen.getByRole('button', { name: /^5 lá/ })).toHaveAttribute('aria-pressed', 'true');
    expect(cardFronts()).toHaveLength(0);
  });

  it('câu hỏi bị cắt thì có "Xem đầy đủ", bấm thành "Thu gọn"', () => {
    vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(800);
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(200);
    render(<RandomPullTab isMobile={false} />);
    drawWith('Một câu hỏi rất dài về công việc, gia đình và những dự định trong năm tới', /^1 lá/);
    const toggle = within(questionBar()).getByRole('button', { name: 'Xem đầy đủ' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(within(questionBar()).getByRole('button', { name: 'Thu gọn' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('câu hỏi không bị cắt thì không có nút "Xem đầy đủ"', () => {
    render(<RandomPullTab isMobile={false} />);
    drawWith('Ngắn', /^1 lá/);
    expect(within(questionBar()).queryByRole('button', { name: 'Xem đầy đủ' })).not.toBeInTheDocument();
  });
});
