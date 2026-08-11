'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextValue {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = (node: ReactNode) => {
    setContent(node);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModalContext must be used within ModalProvider');
  return context;
}
