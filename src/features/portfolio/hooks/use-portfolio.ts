'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getOrdersAction } from '@/features/orders/actions/get-orders';
import type { Order } from '@/features/orders/types';
import {
  getPortfolioAction,
  getPortfolioAllocationAction,
} from '@/features/portfolio/actions/get-portfolio';
import type {
  PortfolioAllocationSlice,
  PortfolioData,
} from '@/features/portfolio/types';

type UsePortfolioArgs = {
  initialPortfolio: PortfolioData;
  initialAllocation: PortfolioAllocationSlice[];
  initialOrders: Order[];
};

export function usePortfolio({
  initialPortfolio,
  initialAllocation,
  initialOrders,
}: UsePortfolioArgs) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [allocation, setAllocation] = useState(initialAllocation);
  const [orders, setOrders] = useState(initialOrders);
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      const [portfolioResult, allocationResult, ordersResult] =
        await Promise.all([
          getPortfolioAction({ fresh: true }),
          getPortfolioAllocationAction(),
          getOrdersAction({ status: 'open' }),
        ]);

      if (!portfolioResult.ok) {
        toast.error(portfolioResult.message);
        return;
      }

      setPortfolio(portfolioResult.data);
      if (allocationResult.ok) setAllocation(allocationResult.data);
      if (ordersResult.ok) setOrders(ordersResult.data.items);
      toast.success('Portfolio synced.');
    });
  }

  return { portfolio, allocation, orders, pending, refresh };
}
