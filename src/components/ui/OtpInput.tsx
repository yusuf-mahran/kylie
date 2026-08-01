'use client';

import clsx from 'clsx';
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useId,
  useRef,
} from 'react';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function OtpInput({
  length = 8,
  value,
  onChange,
  disabled = false,
  error,
  className,
}: OtpInputProps) {
  const uid = useId();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.replace(/\D/g, '').slice(0, length);
  const paddedDigits = digits.padEnd(length, '');

  function updateValue(newValue: string, focusIndex?: number) {
    const sanitized = newValue.replace(/\D/g, '').slice(0, length);
    if (sanitized !== value.replace(/\D/g, '').slice(0, length)) {
      onChange(sanitized);
    }

    if (focusIndex !== undefined && focusIndex >= 0 && focusIndex < length) {
      inputsRef.current[focusIndex]?.focus();
      inputsRef.current[focusIndex]?.select();
    }
  }

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value.replace(/\D/g, '');
    const currentDigit = inputValue.slice(-1);

    const nextValue =
      digits.slice(0, index) + currentDigit + digits.slice(index + 1);

    updateValue(nextValue, currentDigit ? index + 1 : undefined);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        updateValue(digits.slice(0, index) + digits.slice(index + 1));
      } else if (index > 0) {
        updateValue(
          digits.slice(0, index - 1) + digits.slice(index),
          index - 1,
        );
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
      inputsRef.current[index - 1]?.select();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    const focusIndex = Math.min(pasted.length, length - 1);
    updateValue(pasted, focusIndex);
  }

  function handleFocus(index: number) {
    inputsRef.current[index]?.select();
  }

  return (
    <div
      className={clsx(
        'w-full flex flex-col items-center gap-2 font-heading',
        className,
      )}
    >
      <div
        style={{
          gridTemplateColumns: `repeat(${length}, 1fr)`,
        }}
        className="w-full grid gap-1 justify-evenly"
        dir="ltr"
        role="group"
        aria-label="One-time code"
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={`${uid}-${index}`}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={paddedDigits[index] ?? ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={clsx(
              'w-full h-12 text-center flex justify-center items-center pt-1 text-xl font-semibold bg-surface text-neutral-900 rounded-xl border-2 border-transparent',
              'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
              'transition-all duration-200',
              error && 'border-error focus:border-error focus:ring-error/20',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
