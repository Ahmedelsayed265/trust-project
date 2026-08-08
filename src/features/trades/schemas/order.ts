import { z } from 'zod';

export const orderSchema = z
  .object({
    pair: z.string().min(1, 'Select a market'),
    orderType: z.enum(['market', 'limit']),
    side: z.enum(['buy', 'sell']),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine(
        (v) =>
          !Number.isNaN(Number(v.replace(/,/g, ''))) &&
          Number(v.replace(/,/g, '')) > 0,
        {
          message: 'Enter a valid amount',
        },
      ),
    currency: z.string().min(1, 'Currency is required'),
    limitPrice: z.string().optional(),
    percent: z.number().min(0).max(100),
  })
  .superRefine((values, ctx) => {
    if (values.orderType !== 'limit') return;

    const price = Number((values.limitPrice ?? '').replace(/,/g, ''));
    if (!values.limitPrice?.trim() || Number.isNaN(price) || price <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['limitPrice'],
        message: 'Enter a valid limit price',
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderSchema>;

export function parseAmount(value: string) {
  return Number(value.replace(/,/g, '')) || 0;
}
