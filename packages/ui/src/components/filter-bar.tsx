import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Button } from './button';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  options: FilterOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  title?: string;
}

export function FilterBar({
  options,
  selectedValue,
  onSelect,
  title,
  className,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}
      {...props}
    >
      {title && (
        <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mr-2 flex-shrink-0">
          {title}:
        </span>
      )}
      {options.map((opt) => {
        const isSelected = opt.value === selectedValue;
        return (
          <Button
            key={opt.value}
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            className="flex-shrink-0 rounded-full text-xs font-medium"
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className="ml-1.5 opacity-60">({opt.count})</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
