'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Button } from '@cinmax/ui';

export interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/login?redirect=/checkout');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Login Required"
      description="Please login to proceed with checkout."
    >
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          className="w-full sm:w-auto rounded-full font-semibold border-slate-300 dark:border-slate-700 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleLogin}
          className="w-full sm:w-auto rounded-full font-bold bg-[#002754] hover:bg-[#0A3D78] text-white shadow-md cursor-pointer"
        >
          Login
        </Button>
      </div>
    </Dialog>
  );
}
