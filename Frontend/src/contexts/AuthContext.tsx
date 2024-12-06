import React, { createContext, useContext, useState, useEffect, useReducer } from "react";

interface AuthContextProps {
  userName: string | null;
  userAvatar: string | null;
  setUserName: (name: string | null) => void;
  setUserAvatar: (avatar: string | null) => void;
  triggerForceRender: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [forceRender, setForceRender] = useReducer((x) => x + 1, 0);

  const triggerForceRender = () => setForceRender();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserAvatar = localStorage.getItem("userAvatar");
    if (storedUserName) setUserName(storedUserName);
    if (storedUserAvatar) setUserAvatar(storedUserAvatar);
  }, [forceRender]);

  const setUserNameWithStorage = (name: string | null) => {
    setUserName(name);
    if (name) localStorage.setItem("userName", name);
    else localStorage.removeItem("userName");
    triggerForceRender();
  };

  const setUserAvatarWithStorage = (avatar: string | null) => {
    setUserAvatar(avatar);
    if (avatar) localStorage.setItem("userAvatar", avatar);
    else localStorage.removeItem("userAvatar");
    triggerForceRender();
  };

  return (
    <AuthContext.Provider
      value={{
        userName,
        userAvatar,
        setUserName: setUserNameWithStorage,
        setUserAvatar: setUserAvatarWithStorage,
        triggerForceRender,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};