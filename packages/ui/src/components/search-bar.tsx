import * as React from 'react';
import { cn } from '@cinmax/utils';
import { Input } from './input';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onSearch, onClear, placeholder = 'Search botanical soap collection...', ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 rounded-full bg-[#F7F9FB] dark:bg-[#071324] border-[#0A3D78]/15 focus:border-[#0A3D78] dark:border-white/15"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
