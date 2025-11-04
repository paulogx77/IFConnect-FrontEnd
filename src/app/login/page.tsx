// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuario } from '../../context/UsuarioContext';
import { fetchFromAPI } from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  
  const router = useRouter();
  const { login } = useUsuario();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      // Aqui você faria a chamada real para a API
      // Por enquanto, vamos simular um login
      const usuario = await fetchFromAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });

      if (usuario) {
        login(usuario);
        router.push('/feed');
      } else {
        setErro('Credenciais inválidas');
      }
    } catch (error) {
      setErro('Erro ao fazer login');
      console.error('Erro no login:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Login simulado para teste (REMOVA DEPOIS)
  const loginSimulado = () => {
    const usuarioTeste = {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      avatar: ''
    };
    login(usuarioTeste);
    router.push('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">iFConnect</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Botão para login rápido de teste - REMOVA DEPOIS */}
        <div className="mt-4">
          <button
            onClick={loginSimulado}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Entrar como João (Teste)
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem conta? <a href="#" className="text-blue-600 hover:text-blue-500">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}