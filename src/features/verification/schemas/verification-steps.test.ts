import { describe, expect, it } from 'vitest';
import {
  addressSchema,
  identityDocumentSchema,
  personalDetailsSchema,
} from '@/features/verification/schemas/verification-steps';

function makeFile(size = 1024, name = 'doc.pdf') {
  return new File([new Uint8Array(size)], name, { type: 'application/pdf' });
}

describe('personalDetailsSchema', () => {
  it('accepts adult applicants with a 2-letter nationality', () => {
    expect(
      personalDetailsSchema.safeParse({
        legal_first_name: 'Ammar',
        legal_last_name: 'Nashat',
        date_of_birth: '1995-01-01',
        nationality: 'EG',
      }).success,
    ).toBe(true);
  });

  it('rejects underage date of birth', () => {
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 10);
    expect(
      personalDetailsSchema.safeParse({
        legal_first_name: 'Kid',
        legal_last_name: 'User',
        date_of_birth: recent.toISOString().slice(0, 10),
        nationality: 'EG',
      }).success,
    ).toBe(false);
  });
});

describe('identityDocumentSchema', () => {
  it('requires a non-empty front file', () => {
    expect(
      identityDocumentSchema.safeParse({
        document_type: 'passport',
        document_front: makeFile(),
        document_back: null,
      }).success,
    ).toBe(true);

    expect(
      identityDocumentSchema.safeParse({
        document_type: 'passport',
        document_front: makeFile(0),
      }).success,
    ).toBe(false);
  });

  it('rejects files larger than 8 MB', () => {
    expect(
      identityDocumentSchema.safeParse({
        document_type: 'national_id',
        document_front: makeFile(8 * 1024 * 1024 + 1),
      }).success,
    ).toBe(false);
  });
});

describe('addressSchema', () => {
  it('accepts a complete address proof payload', () => {
    expect(
      addressSchema.safeParse({
        document_type: 'utility_bill',
        document_front: makeFile(),
        address_line: '12 Nile St',
        city: 'Cairo',
        country: 'EG',
        postal_code: '11511',
      }).success,
    ).toBe(true);
  });

  it('requires city and address line', () => {
    expect(
      addressSchema.safeParse({
        document_type: 'bank_statement',
        document_front: makeFile(),
        address_line: '',
        city: '',
        country: 'EG',
      }).success,
    ).toBe(false);
  });
});
