'use client';

import { useEffect } from 'react';

export function PublicThemeReset() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
  }, []);

  return null;
}
