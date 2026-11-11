// Loads the real stylesheets so tests (and axe's contrast checks) see what users see.
import '../../dist/tokens.css';
import '../css/base.css';
import.meta.glob('../css/components/*.css', { eager: true });
import '../css/motion.css';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});
