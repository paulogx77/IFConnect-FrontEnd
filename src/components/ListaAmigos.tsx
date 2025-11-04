// src/components/ListaAmigos.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../lib/api';
import Link from 'next/link';

interface ListaAmigosProps {
  usuarioId: string;
}

const ListaAmigos = ({ usuarioId }: ListaAmigosProps) => {
  const [amigos, setAmigos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAmigos();
  }, [usuarioId]);

  const carregarAmigos = async () => {
    try {
      const data = await fetchFromAPI(`/amizades/amigos/${usuarioId}`);
      setAmigos(data);
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <div>Carregando amigos...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Amigos ({amigos.length})</h3>
      <div className="space-y-2">
        {amigos.map(amigo => (
          <Link
            key={amigo.id}
            href={`/perfil/${amigo.id}`}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {amigo.nome.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{amigo.nome}</span>
          </Link>
        ))}

        {amigos.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhum amigo ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListaAmigos;