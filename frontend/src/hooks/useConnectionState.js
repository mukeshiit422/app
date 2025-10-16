import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useConnectionState = create(
  persist(
    (set) => ({
      isConnected: false,
      setIsConnected: (state) => set({ isConnected: state }),
    }),
    {
      name: 'connection-storage',
    }
  )
);

export default useConnectionState;