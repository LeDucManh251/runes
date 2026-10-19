export type SpreadId = 'one' | 'two' | 'three' | 'five';

export interface Spread {
  id: SpreadId;
  count: number;
  /** Mô tả ngắn hiện trên nút chọn kiểu trải bài. */
  label: string;
  /** Tên vị trí của từng lá, độ dài bằng `count`. */
  positions: string[];
}

export const SPREADS: Spread[] = [
  { id: 'one', count: 1, label: 'Thông điệp', positions: ['Thông điệp chính'] },
  { id: 'two', count: 2, label: 'Chú ý – Phản hồi', positions: ['Điều cần chú ý', 'Cách nên phản hồi'] },
  {
    id: 'three',
    count: 3,
    label: 'Quá khứ – Hiện tại – Tiếp theo',
    positions: ['Ảnh hưởng quá khứ', 'Tình huống hiện tại', 'Bước tiếp theo']
  },
  {
    id: 'five',
    count: 5,
    label: 'Toàn cảnh',
    positions: ['Gốc rễ vấn đề', 'Thử thách', 'Sự hỗ trợ ẩn', 'Hành động nên làm', 'Xu hướng sắp tới']
  }
];

export const getSpread = (id: SpreadId): Spread => SPREADS.find((spread) => spread.id === id) ?? SPREADS[0];
