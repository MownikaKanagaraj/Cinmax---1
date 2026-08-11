import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@cinmax/utils';

export interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  className?: string;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  min = 1,
  max = 99,
  onChange,
  className,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-[#E2E8F0] bg-white p-1 shadow-sm',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#434750] transition hover:bg-[#F2F4F6] disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[#191C1E] select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#434750] transition hover:bg-[#F2F4F6] disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
