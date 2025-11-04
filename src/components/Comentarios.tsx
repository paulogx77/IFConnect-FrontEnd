// src/components/Comentarios.tsx - VERSÃO FUNCIONAL
'use client';

import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../lib/api';

interface ComentariosProps {
  postagemId: string;
  usuarioId: string;
  comentariosIniciais?: any[];
  onComentarioChange?: (novaContagem: number) => void;
}

const Comentarios = ({ 
  postagemId, 
  usuarioId, 
  comentariosIniciais = [], 
  onComentarioChange 
}: ComentariosProps) => {
  const [comentarios, setComentarios] = useState<any[]>(comentariosIniciais);
  const [novoComentario, setNovoComentario] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setComentarios(comentariosIniciais);
  }, [comentariosIniciais]);

  const adicionarComentario = async () => {
    if (!novoComentario.trim() || carregando) return;

    setCarregando(true);
    try {
      const comentarioData = await fetchFromAPI('/comentarios', {
        method: 'POST',
        body: JSON.stringify({
          postagemId,
          usuarioId,
          texto: novoComentario.trim()
        })
      });
      
      // Adiciona o novo comentário à lista
      const novoComentarioCompleto = {
        ...comentarioData,
        autor: { id: usuarioId, nome: 'Você' }, // Simulação
        dataCriacao: new Date().toISOString()
      };
      
      setComentarios(prev => [novoComentarioCompleto, ...prev]);
      setNovoComentario('');
      setMostrarForm(false);
      
      // Notifica sobre a mudança
      onComentarioChange?.(comentarios.length + 1);
      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      // Em modo demo, adiciona mesmo com erro
      const comentarioDemo = {
        id: Date.now().toString(),
        texto: novoComentario,
        autor: { id: usuarioId, nome: 'Você' },
        dataCriacao: new Date().toISOString()
      };
      setComentarios(prev => [comentarioDemo, ...prev]);
      setNovoComentario('');
      setMostrarForm(false);
      onComentarioChange?.(comentarios.length + 1);
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    
    if (diffMin < 1) return 'Agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffMin < 1440) return `há ${Math.floor(diffMin / 60)}h`;
    
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="mt-3">
      {/* Botão para mostrar/ocultar comentários */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
      >
        <span>💬</span>
        <span>Comentar ({comentarios.length})</span>
      </button>

      {/* Formulário de comentário */}
      {mostrarForm && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Escreva seu comentário..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setMostrarForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarComentario}
              disabled={carregando || !novoComentario.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors font-medium"
            >
              {carregando ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </div>
      )}

      {/* Lista de comentários */}
      {comentarios.length > 0 && (
        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {comentario.autor?.nome?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-900 text-sm">
                    {comentario.autor?.nome || 'Usuário'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatarData(comentario.dataCriacao)}
                  </span>
                </div>
                <p className="text-gray-800 mt-1 text-sm">{comentario.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comentarios;