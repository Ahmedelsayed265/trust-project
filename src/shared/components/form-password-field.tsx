"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormPasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export function FormPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  className,
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

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
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={visible ? "text" : "password"}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={fieldState.invalid}
                className="h-11 rounded-xl bg-card pr-10 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setVisible((v) => !v)}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("h-11 rounded-xl bg-card pr-10 text-sm", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
