import { describe, expect, it } from 'vitest';
import { mapActionError } from '@/shared/lib/api/action-result';
import { ApiError } from '@/shared/lib/api/types';

describe('mapActionError', () => {
  it('maps ApiError with field errors and status', () => {
    const error = new ApiError('Validation failed', 422, {
      message: 'Validation failed',
      errors: { email: ['Taken'], password: 'Too short' },
    });

    expect(mapActionError(error, 'Fallback')).toEqual({
      ok: false,
      message: 'Validation failed',
      errors: { email: ['Taken'], password: ['Too short'] },
      status: 422,
    });
  });

  it('allows overriding the ApiError message', () => {
    const error = new ApiError('Original', 401);
    expect(
      mapActionError(error, 'Fallback', {
        message: () => 'Custom message',
      }),
    ).toEqual({
      ok: false,
      message: 'Custom message',
      errors: undefined,
      status: 401,
    });
  });

  it('uses Error.message for non-ApiError Error instances', () => {
    expect(mapActionError(new Error('Boom'), 'Fallback')).toEqual({
      ok: false,
      message: 'Boom',
    });
  });

  it('falls back for unknown values', () => {
    expect(mapActionError('nope', 'Fallback')).toEqual({
      ok: false,
      message: 'Fallback',
    });
  });
});
