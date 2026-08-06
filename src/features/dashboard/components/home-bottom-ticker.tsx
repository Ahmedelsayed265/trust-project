'use client';

import { usePathname } from 'next/navigation';
import { BottomTicker } from './bottom-ticker';
import type { MarketTickerItem } from '@/features/markets/types';

export function HomeBottomTicker({ items }: { items: MarketTickerItem[] }) {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <BottomTicker items={items} />;
}
