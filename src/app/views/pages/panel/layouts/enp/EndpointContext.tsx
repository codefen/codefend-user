import { type FC, createContext, useContext, useState, type ReactNode } from 'react';

type EndpointAppContextType = {
  endpointAppStore: any;
  setEndpointAppStore: React.Dispatch<React.SetStateAction<any>>;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const EndpointAppContext = createContext<EndpointAppContextType>({
  endpointAppStore: {},
  setEndpointAppStore: () => {},
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

type EndpointAppProviderProps = {
  children: ReactNode;
};

export const EndpointAppProvider: FC<EndpointAppProviderProps> = ({ children }) => {
  const [endpointAppStore, setEndpointAppStore] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <EndpointAppContext.Provider
      value={{
        endpointAppStore,
        setEndpointAppStore,
        isModalOpen,
        openModal,
        closeModal,
      }}>
      {children}
    </EndpointAppContext.Provider>
  );
};

export const useEndpointAppStore = () => {
  const context = useContext(EndpointAppContext);
  if (!context) {
    throw new Error('useEndpointAppStore must be used within an EndpointAppProvider');
  }
  return context;
};
