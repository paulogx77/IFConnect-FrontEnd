// src/components/CriarPostagem.tsx - Adicione a prop onPostagemCriada
'use client';

import { useState } from 'react';
import { fetchFromAPI } from '../lib/api';

interface CriarPostagemProps {
  usuarioId: string;
  onPostagemCriada?: () => void;
}

const CriarPostagem = ({ usuarioId, onPostagemCriada }: CriarPostagemProps) => {
  const [conteudo, setConteudo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const publicarPostagem = async () => {
    if (!conteudo.trim() || carregando) return;

    setCarregando(true);
    try {
      await fetchFromAPI('/postagens', {
        method: 'POST',
        body: JSON.stringify({
          conteudo,
          autorId: usuarioId
        })
      });
      
      setConteudo('');
      alert('✅ Postagem publicada com sucesso!');
      
      // Chama a função para atualizar o feed
      if (onPostagemCriada) {
        onPostagemCriada();
      }
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('❌ Erro ao publicar postagem');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Criar Postagem</h3>
      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="O que você está pensando?"
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        rows={4}
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={publicarPostagem}
          disabled={carregando || !conteudo.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors font-medium"
        >
          {carregando ? '📤 Publicando...' : '📝 Publicar'}
        </button>
      </div>
    </div>
  );
};

export default CriarPostagem;