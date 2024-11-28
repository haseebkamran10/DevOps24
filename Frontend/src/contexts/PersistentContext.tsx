import React, { createContext, useContext, useState, useEffect } from "react";

interface PersistentContextProps {
  getState: (key: string) => any; 
  setState: (key: string, value: any) => void; 
  removeState: (key: string) => void; 
  clearAll: () => void; 
}

const PersistentContext = createContext<PersistentContextProps | undefined>(undefined);

export const PersistentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setStateInternal] = useState<{ [key: string]: any }>({});

  // Initialize from localStorage
  useEffect(() => {
    const storedState = Object.keys(localStorage).reduce((acc, key) => {
      try {
        acc[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        acc[key] = localStorage.getItem(key); 
      }
      return acc;
    }, {} as { [key: string]: any });

    setStateInternal(storedState);
  }, []);


  const getState = (key: string) => {
    return state[key];
  };
  const setState = (key: string, value: any) => {
    setStateInternal((prev) => ({ ...prev, [key]: value }));
    localStorage.setItem(key, JSON.stringify(value));
  };


  const removeState = (key: string) => {
    setStateInternal((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    localStorage.removeItem(key);
  };

  const clearAll = () => {
    setStateInternal({});
    localStorage.clear();
  };

  return (
    <PersistentContext.Provider value={{ getState, setState, removeState, clearAll }}>
      {children}
    </PersistentContext.Provider>
  );
};
export const usePersistent = () => {
  const context = useContext(PersistentContext);
  if (!context) {
    throw new Error("usePersistent must be used within a PersistentProvider");
  }
  return context;
};
