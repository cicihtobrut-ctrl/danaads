import { createContext, useContext, useState } from 'react';
import { createBrowserClient } from './supabaseClient';

// 1. Membuat Context
const SupabaseContext = createContext(undefined);

// 2. Membuat Provider Component
export function SupabaseProvider({ children }) {
  // Membuat instance client sekali saja menggunakan useState
  const [supabase] = useState(() => createBrowserClient());

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// 3. Membuat custom hook untuk menggunakan context dengan mudah
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context.supabase;
};

