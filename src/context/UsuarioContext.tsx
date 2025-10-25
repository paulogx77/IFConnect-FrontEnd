'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

interface UsuarioContextType {
  usuario: Usuario | null;
  login: (usuarioData: Usuario) => void;
  logout: () => void;
  carregando: boolean;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const login = (usuarioData: Usuario) => {
    setUsuario(usuarioData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
}