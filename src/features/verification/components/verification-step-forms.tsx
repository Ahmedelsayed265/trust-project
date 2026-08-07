'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SheetFooter } from '@/components/ui/sheet';
import { submitVerificationStepAction } from '@/features/verification/actions/submit-verification-step';
import {
  addressSchema,
  identityDocumentSchema,
  personalDetailsSchema,
  type AddressValues,
  type IdentityDocumentValues,
  type PersonalDetailsValues,
} from '@/features/verification/schemas/verification-steps';
import { FormTextField } from '@/shared/components/form-text-field';
import { DateInput } from '@/shared/components/date-input';

const identityTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'driving_license', label: 'Driving license' },
] as const;

const addressTypes = [
  { value: 'utility_bill', label: 'Utility bill' },
  { value: 'bank_statement', label: 'Bank statement' },
] as const;

function appendPayload(formData: FormData, payload: Record<string, string>) {
  for (const [key, value] of Object.entries(payload)) {
    if (value) formData.append(`payload[${key}]`, value);
  }
}

function FileField({
  id,
  label,
  error,
  optional,
  onChange,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  onChange: (file: File | null) => void;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>
        {label}
        {optional ? (
          <span className="text-muted-foreground font-normal"> (optional)</span>
        ) : null}
      </FieldLabel>
      <FieldContent>
        <Input
          id={id}
          type="file"
          accept="image/*,.pdf"
          className="h-12 rounded-xl px-2.5 py-2.5 file:mr-3"
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null);
          }}
        />
        <p className="text-muted-foreground text-xs">
          Max 8 MB · JPG, PNG, PDF
        </p>
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  );
}

type StepFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function PersonalDetailsForm({ onSuccess, onCancel }: StepFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      legal_first_name: '',
      legal_last_name: '',
      date_of_birth: '',
      nationality: '',
    },
  });

  function onSubmit(values: PersonalDetailsValues) {
    startTransition(async () => {
      const formData = new FormData();
      appendPayload(formData, {
        legal_first_name: values.legal_first_name,
        legal_last_name: values.legal_last_name,
        date_of_birth: values.date_of_birth,
        nationality: values.nationality.toUpperCase(),
      });

      const result = await submitVerificationStepAction(
        'personal_details',
        formData,
      );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success('Personal details submitted.');
      onSuccess();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="space-y-4 overflow-y-auto px-4 py-2">
        <FormTextField
          control={form.control}
          name="legal_first_name"
          label="Legal first name"
          autoComplete="given-name"
          inputClassName="h-12 rounded-xl bg-background px-2.5"
        />
        <FormTextField
          control={form.control}
          name="legal_last_name"
          label="Legal last name"
          autoComplete="family-name"
          inputClassName="h-12 rounded-xl bg-background px-2.5"
        />
        <Controller
          control={form.control}
          name="date_of_birth"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="date_of_birth">Date of birth</FieldLabel>
              <FieldContent>
                <DateInput
                  id="date_of_birth"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select date of birth"
                  invalid={fieldState.invalid}
                  adultOnly
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </FieldContent>
            </Field>
          )}
        />
        <FormTextField
          control={form.control}
          name="nationality"
          label="Nationality"
          placeholder="EG"
          inputClassName="h-12 rounded-xl bg-background px-2.5 uppercase"
        />
      </div>
      <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit step'}
        </Button>
      </SheetFooter>
    </form>
  );
}

export function IdentityDocumentForm({ onSuccess, onCancel }: StepFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<IdentityDocumentValues>({
    resolver: zodResolver(identityDocumentSchema),
    defaultValues: {
      document_type: 'passport',
      document_back: null,
    },
  });

  function onSubmit(values: IdentityDocumentValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('document_type', values.document_type);
      formData.append('document_front', values.document_front);
      if (values.document_back) {
        formData.append('document_back', values.document_back);
      }

      const result = await submitVerificationStepAction(
        'identity_document',
        formData,
      );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success('Identity document submitted.');
      onSuccess();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="space-y-4 overflow-y-auto px-4 py-2">
        <Controller
          control={form.control}
          name="document_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="identity-document-type">
                Document type
              </FieldLabel>
              <FieldContent>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  items={[...identityTypes]}
                >
                  <SelectTrigger
                    id="identity-document-type"
                    className="bg-background h-12 w-full min-w-0 rounded-xl px-2.5 py-3 data-[size=default]:h-12"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    {identityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="document_front"
          render={({ field, fieldState }) => (
            <FileField
              id="identity-document-front"
              label="Front of document"
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="document_back"
          render={({ field, fieldState }) => (
            <FileField
              id="identity-document-back"
              label="Back of document"
              optional
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit step'}
        </Button>
      </SheetFooter>
    </form>
  );
}

export function AddressForm({ onSuccess, onCancel }: StepFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      document_type: 'utility_bill',
      address_line: '',
      city: '',
      country: '',
      postal_code: '',
    },
  });

  function onSubmit(values: AddressValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('document_type', values.document_type);
      formData.append('document_front', values.document_front);
      appendPayload(formData, {
        address_line: values.address_line,
        city: values.city,
        country: values.country.toUpperCase(),
        ...(values.postal_code ? { postal_code: values.postal_code } : {}),
      });

      const result = await submitVerificationStepAction('address', formData);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success('Address verification submitted.');
      onSuccess();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="space-y-4 overflow-y-auto px-4 py-2">
        <Controller
          control={form.control}
          name="document_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="address-document-type">
                Document type
              </FieldLabel>
              <FieldContent>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  items={[...addressTypes]}
                >
                  <SelectTrigger
                    id="address-document-type"
                    className="bg-background h-12 w-full min-w-0 rounded-xl px-2.5 py-3 data-[size=default]:h-12"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    {addressTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="document_front"
          render={({ field, fieldState }) => (
            <FileField
              id="address-document-front"
              label="Proof of address"
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
        <FormTextField
          control={form.control}
          name="address_line"
          label="Address line"
          autoComplete="street-address"
          inputClassName="h-12 rounded-xl bg-background px-2.5"
        />
        <FormTextField
          control={form.control}
          name="city"
          label="City"
          autoComplete="address-level2"
          inputClassName="h-12 rounded-xl bg-background px-2.5"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormTextField
            control={form.control}
            name="country"
            label="Country"
            placeholder="EG"
            autoComplete="country"
            inputClassName="h-12 rounded-xl bg-background px-2.5 uppercase"
          />
          <FormTextField
            control={form.control}
            name="postal_code"
            label="Postal code"
            autoComplete="postal-code"
            inputClassName="h-12 rounded-xl bg-background px-2.5"
          />
        </div>
      </div>
      <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit step'}
        </Button>
      </SheetFooter>
    </form>
  );
}
