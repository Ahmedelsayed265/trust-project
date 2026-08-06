'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  CancelOrderInput,
  GetOrderFillsInput,
  GetOrdersInput,
  Order,
  OrderFill,
  OrderSummaryInput,
  OrderSummaryPreview,
  OrdersData,
  PlaceOrderInput,
} from '@/features/orders/types';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';

function mapError(error: unknown, fallback: string): ActionResult<never> {
  if (error instanceof ApiError) {
    return {
      ok: false,
      message: error.message || fallback,
      errors: error.errors,
      status: error.status,
    };
  }

  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

function clampLimit(value?: number) {
  if (value == null) return 20;
  return Math.min(100, Math.max(1, value));
}

export async function getOrdersAction(
  input: GetOrdersInput = {},
): Promise<ActionResult<OrdersData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<OrdersData>>(
      '/user/orders',
      {
        token,
        query: {
          status: input.status || 'all',
          provider_id: input.provider_id?.trim() || undefined,
          symbol: input.symbol?.trim() || undefined,
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load orders.');
  }
}

export async function getOrderByIdAction(
  id: string,
  providerId?: string,
): Promise<ActionResult<Order>> {
  try {
    const orderId = id.trim();
    if (!orderId) {
      return { ok: false, message: 'Order id is required.' };
    }

    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<Order>>(
      `/user/orders/${encodeURIComponent(orderId)}`,
      {
        token,
        query: {
          provider_id: providerId?.trim() || undefined,
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load order.');
  }
}

export async function getOrderFillsAction(
  input: GetOrderFillsInput = {},
): Promise<ActionResult<OrderFill[]>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<OrderFill[]>>(
      '/user/orders/fills',
      {
        token,
        query: {
          provider_id: input.provider_id?.trim() || undefined,
          symbol: input.symbol?.trim() || undefined,
          limit: clampLimit(input.limit),
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load fills.');
  }
}

export async function cancelOrderAction(
  input: CancelOrderInput,
): Promise<ActionResult<Order>> {
  try {
    const orderId = input.id.trim();
    if (!orderId) {
      return { ok: false, message: 'Order id is required.' };
    }

    const token = await requireAuth();
    const providerId = input.provider_id?.trim() || undefined;
    const response = await api.post<ApiSuccessResponse<Order>>(
      `/user/orders/${encodeURIComponent(orderId)}/cancel`,
      providerId ? { provider_id: providerId } : {},
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to cancel order.');
  }
}

export async function previewOrderSummaryAction(
  input: OrderSummaryInput,
): Promise<ActionResult<OrderSummaryPreview>> {
  try {
    const symbol = input.symbol.trim();
    if (!symbol) {
      return { ok: false, message: 'Symbol is required.' };
    }

    const hasQty = input.qty != null && input.qty > 0;
    const hasQuote = input.quote_amount != null && input.quote_amount > 0;
    if (!hasQty && !hasQuote) {
      return { ok: false, message: 'Provide qty or quote_amount.' };
    }

    if (
      input.type === 'limit' &&
      !(input.limit_price != null && input.limit_price > 0)
    ) {
      return {
        ok: false,
        message: 'Limit price is required for limit orders.',
      };
    }

    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<OrderSummaryPreview>>(
      '/user/orders/summary',
      {
        provider_id: input.provider_id?.trim() || undefined,
        symbol,
        side: input.side,
        type: input.type,
        qty: hasQty ? input.qty : undefined,
        quote_amount: hasQuote ? input.quote_amount : undefined,
        limit_price: input.type === 'limit' ? input.limit_price : undefined,
      },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to preview order.');
  }
}

export async function placeOrderAction(
  input: PlaceOrderInput,
): Promise<ActionResult<Order>> {
  try {
    const symbol = input.symbol.trim();
    if (!symbol) {
      return { ok: false, message: 'Symbol is required.' };
    }

    const hasQty = input.qty != null && input.qty > 0;
    const hasQuote = input.quote_amount != null && input.quote_amount > 0;
    if (!hasQty && !hasQuote) {
      return { ok: false, message: 'Provide qty or quote_amount.' };
    }

    if (
      input.type === 'limit' &&
      !(input.limit_price != null && input.limit_price > 0)
    ) {
      return {
        ok: false,
        message: 'Limit price is required for limit orders.',
      };
    }

    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<Order>>(
      '/user/orders',
      {
        provider_id: input.provider_id?.trim() || undefined,
        symbol,
        side: input.side,
        type: input.type,
        qty: hasQty ? input.qty : undefined,
        quote_amount: hasQuote ? input.quote_amount : undefined,
        limit_price: input.type === 'limit' ? input.limit_price : undefined,
        client_order_id: input.client_order_id?.trim() || undefined,
      },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to place order.');
  }
}
