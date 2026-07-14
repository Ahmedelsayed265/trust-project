"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
};

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "text",
  placeholder,
  autoComplete,
  className,
  inputClassName,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid || undefined}
          className={className}
        >
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            <Input
              {...field}
              id={field.name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className={cn("h-11 rounded-xl bg-card text-sm", inputClassName)}
            />
            {description && !fieldState.error && (
              <FieldDescription>{description}</FieldDescription>
            )}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}
