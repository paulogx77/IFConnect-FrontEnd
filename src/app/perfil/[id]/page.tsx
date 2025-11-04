// src/app/perfil/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromAPI } from '../../../lib/api';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

export default function PerfilUsuario() {
  const params = useParams();
  const usuarioId = params.id as string;
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [postagens, setPostagens] = useState<any[]>([]);
  const [ehAmigo, setEhAmigo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, [usuarioId]);

  const carregarPerfil = async () => {
    try {
      setCarregando(true);
      const [usuarioData, postagensData, amizadeData] = await Promise.all([
        fetchFromAPI(`/usuarios/${usuarioId}`),
        fetchFromAPI(`/postagens/usuario/${usuarioId}`),
        fetchFromAPI(`/amizades/verificar/${usuarioId}`)
      ]);
      
      setUsuario(usuarioData);
      setPostagens(postagensData);
      setEhAmigo(amizadeData.ehAmigo);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarAmigo = async () => {
    try {
      await fetchFromAPI('/amizades/adicionar', {
        method: 'POST',
        body: JSON.stringify({ amigoId: usuarioId })
      });
      setEhAmigo(true);
    } catch (error) {
      console.error('Erro ao adicionar amigo:', error);
    }
  };

  if (carregando) return <div>Carregando perfil...</div>;
  if (!usuario) return <div>Usuário não encontrado</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Cabeçalho do perfil */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            {usuario.avatar ? (
              <img src={usuario.avatar} alt={usuario.nome} className="w-full h-full rounded-full" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{usuario.nome}</h1>
            <p className="text-gray-600">{usuario.email}</p>
          </div>
          <div>
            {!ehAmigo ? (
              <button
                onClick={adicionarAmigo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Adicionar Amigo
              </button>
            ) : (
              <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                Amigo ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Postagens do usuário */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Postagens</h2>
        {postagens.map(postagem => (
          <div key={postagem.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <p>{postagem.conteudo}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {new Date(postagem.dataCriacao).toLocaleDateString('pt-BR')}
              </span>
              <div className="flex space-x-2 text-sm text-gray-500">
                <span>{postagem.curtidas.length} curtidas</span>
                <span>{postagem.comentarios.length} comentários</span>
              </div>
            </div>
          </div>
        ))}
        
        {postagens.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Este usuário ainda não fez nenhuma postagem.
          </p>
        )}
      </div>
    </div>
  );
}