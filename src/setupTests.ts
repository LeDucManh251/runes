import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest không bật `globals` nên RTL không tự cleanup — dọn DOM giữa các test ở đây.
afterEach(() => {
  cleanup();
});
