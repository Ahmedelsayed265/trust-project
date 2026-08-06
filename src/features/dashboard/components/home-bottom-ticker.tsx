'use client';

import { usePathname } from 'next/navigation';
import { BottomTicker } from './bottom-ticker';

export function HomeBottomTicker() {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <BottomTicker />;
}
