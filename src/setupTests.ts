import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest không bật `globals` nên RTL không tự cleanup — dọn DOM giữa các test ở đây.
afterEach(() => {
  cleanup();
});

// jsdom không có canvas: trả null để StarMist tự bỏ qua thay vì in lỗi "Not implemented".
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
