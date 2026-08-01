'use client';

import clsx from 'clsx';
import { ComponentPropsWithoutRef, ReactNode, forwardRef, useId } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  wrapperClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    startIcon,
    endIcon,
    wrapperClassName,
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;

  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-sm font-medium text-neutral-800"
        >
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <span className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            {startIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.75 bg-surface rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
            error && 'border-error focus:border-error focus:ring-error/20',
            startIcon && 'ps-12',
            endIcon && 'pe-12',
            className,
          )}
          {...props}
        />
        {endIcon && (
          <span className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {endIcon}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
