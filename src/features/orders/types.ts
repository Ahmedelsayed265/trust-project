export type OrderSide = 'buy' | 'sell';

export type OrderStatus =
  | 'new'
  | 'partially_filled'
  | 'filled'
  | 'canceled'
  | 'cancelled'
  | 'rejected'
  | string;

export type OrderType = 'limit' | 'market' | string;

export type Order = {
  id: string;
  client_order_id: string | null;
  symbol: string;
  display_symbol: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  filled_qty: number;
  remaining_qty: number;
  limit_price: number | null;
  avg_fill_price: number | null;
  quote_amount: number;
  status: OrderStatus;
  is_open: boolean;
  reject_reason: string | null;
  fee: number;
  fee_asset: string;
  created_at: string;
  updated_at: string;
  provider_id: string;
  account: string;
};

export type OrdersSummaryData = {
  total: number;
  open: number;
  filled: number;
  canceled: number;
  open_value: number;
};

export type OrdersData = {
  items: Order[];
  summary: OrdersSummaryData;
};

export type OrdersStatusFilter =
  'all' | 'open' | 'filled' | 'canceled' | string;

export type GetOrdersInput = {
  status?: OrdersStatusFilter;
  provider_id?: string;
  symbol?: string;
};

export type OrderFill = {
  id: string;
  order_id: string;
  symbol: string;
  display_symbol: string;
  side: OrderSide;
  qty: number;
  price: number;
  notional: number;
  fee: number;
  fee_asset: string;
  created_at: string;
  provider_id: string;
  account: string;
};

export type GetOrderFillsInput = {
  provider_id?: string;
  symbol?: string;
  limit?: number;
};

export type CancelOrderInput = {
  id: string;
  provider_id?: string;
};

export type OrderSummaryInput = {
  provider_id?: string;
  symbol: string;
  side: OrderSide;
  type: 'market' | 'limit';
  qty?: number;
  quote_amount?: number;
  limit_price?: number;
};

export type PlaceOrderInput = OrderSummaryInput & {
  client_order_id?: string;
};

export type OrderSummaryPreview = {
  provider_id: string;
  symbol: string;
  display_symbol: string;
  side: OrderSide;
  type: OrderType;
  market_price: number;
  price: number;
  qty: number;
  qty_label: string;
  subtotal: number;
  fee: number;
  fee_rate_pct: number;
  total: number;
  currency: string;
  buying_power: number;
};
