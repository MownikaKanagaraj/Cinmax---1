import * as React from 'react';
import { Button, ButtonProps } from '../button';

export interface RetryButtonProps extends ButtonProps {
  onRetry: () => void | Promise<void>;
  label?: string;
}

export function RetryButton({
  onRetry,
  label = 'Retry Action',
  variant = 'outline',
  size = 'sm',
  ...props
}: RetryButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onRetry();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Retrying...
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {label}
        </span>
      )}
    </Button>
  );
}
