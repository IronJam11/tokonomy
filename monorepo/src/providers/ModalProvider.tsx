
'use client';
import { useEffect } from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import CreateCoinModal from '@/components/addCoinComponent';

interface CoinData {
  name?: string;
  symbol?: string;
  description?: string;
  assetType?: string;
  links?: Array<{platform: string, url: string}>;
  image?: File | null;
  currency?: string;
  initialPurchaseAmount?: string;
}

interface ModalContextType {
  openCreateCoinModal: (data?: CoinData) => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinData, setCoinData] = useState<CoinData>({});



  const openCreateCoinModal = (data: CoinData = {}) => {
    setCoinData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCoinData({});
  };

  return (
    <ModalContext.Provider value={{ openCreateCoinModal, closeModal, isModalOpen }}>
      {children}
      <CreateCoinModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={coinData}
        trigger={undefined}
      />
    </ModalContext.Provider>
  );
};