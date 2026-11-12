// Loads the stylesheet exactly as apps get it, so tests (and axe's contrast checks) see what users see.
import '../../dist/styles.css';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});
