'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuario } from '../../context/UsuarioContext';
import ListaAmigos from '../../components/ListaAmigos';
import CriarPostagem from '../../components/CriarPostagem';
import CurtirButton from '../../components/CurtirButton';
import Comentarios from '../../components/Comentarios';
import { fetchFromAPI } from '../../lib/api';

interface Postagem {
  id: string;
  conteudo: string;
  autor: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  dataCriacao: string;
  curtidas: any[];
  comentarios: any[];
}

export default function Feed() {
  const { usuario, carregando: carregandoUsuario } = useUsuario();
  const router = useRouter();
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [carregandoPostagens, setCarregandoPostagens] = useState(true);

  useEffect(() => {
    if (!carregandoUsuario && !usuario) {
      router.push('/login');
    } else if (usuario) {
      carregarPostagens();
    }
  }, [usuario, carregandoUsuario, router]);

  const carregarPostagens = async () => {
    try {
      setCarregandoPostagens(true);
      const postagensData = await fetchFromAPI('/postagens');
      
      // Garante que as postagens tenham a estrutura correta
      const postagensFormatadas = (postagensData || []).map((postagem: any) => ({
        id: postagem.id || Date.now().toString(),
        conteudo: postagem.conteudo || 'Postagem sem conteúdo',
        autor: postagem.autor || { 
          id: 'desconhecido', 
          nome: 'Usuário Desconhecido', 
          email: '' 
        },
        dataCriacao: postagem.dataCriacao || new Date().toISOString(),
        curtidas: postagem.curtidas || [],
        comentarios: postagem.comentarios || []
      }));
      
      setPostagens(postagensFormatadas);
    } catch (error) {
      console.error('Erro ao carregar postagens:', error);
      setPostagens([]);
    } finally {
      setCarregandoPostagens(false);
    }
  };

  const atualizarFeed = () => {
    carregarPostagens();
  };

  const atualizarCurtidas = (postagemId: string, novaContagem: number) => {
    setPostagens(prev => prev.map(postagem => 
      postagem.id === postagemId 
        ? { 
            ...postagem, 
            curtidas: Array(novaContagem).fill({ usuarioId: usuario?.id }) 
          }
        : postagem
    ));
  };

  const atualizarComentarios = (postagemId: string, novaContagem: number) => {
    setPostagens(prev => prev.map(postagem => 
      postagem.id === postagemId 
        ? { 
            ...postagem, 
            comentarios: Array(novaContagem).fill({}) 
          }
        : postagem
    ));
  };

  if (carregandoUsuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">IFConnect</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-medium">Olá, <strong className="text-blue-600">{usuario.nome}</strong></span>
              <button 
                onClick={() => router.push(`/perfil/${usuario.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                Meu Perfil
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('usuario');
                  window.location.href = '/login';
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar com Amigos */}
          <div className="w-1/4">
            <ListaAmigos usuarioId={usuario.id} />
          </div>

          {/* Feed Principal */}
          <div className="flex-1">
            <CriarPostagem usuarioId={usuario.id} onPostagemCriada={atualizarFeed} />
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feed de Notícias</h2>
              
              {carregandoPostagens ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-700 font-medium">Carregando postagens...</p>
                </div>
              ) : postagens.length > 0 ? (
                <div className="space-y-6">
                  {postagens.map((postagem) => (
                    <div key={postagem.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      {/* Cabeçalho da Postagem */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {(postagem.autor?.nome || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              {postagem.autor?.nome || 'Usuário Desconhecido'}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              {new Date(postagem.dataCriacao).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => router.push(`/perfil/${postagem.autor?.id || '1'}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Ver Perfil →
                        </button>
                      </div>
                      
                      {/* Conteúdo da Postagem */}
                      <p className="text-gray-800 text-lg mb-6 leading-relaxed">{postagem.conteudo}</p>
                      
                      {/* Ações da Postagem */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex space-x-4">
                          <CurtirButton 
                            postagemId={postagem.id}
                            usuarioId={usuario.id}
                            curtidasIniciais={postagem.curtidas}
                            onCurtidaChange={(novaContagem) => {
                              atualizarCurtidas(postagem.id, novaContagem);
                            }}
                          />
                          
                          <Comentarios 
                            postagemId={postagem.id}
                            usuarioId={usuario.id}
                            comentariosIniciais={postagem.comentarios}
                            onComentarioChange={(novaContagem) => {
                              atualizarComentarios(postagem.id, novaContagem);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                  <div className="text-7xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Nenhuma postagem ainda
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Seja o primeiro a fazer uma postagem ou aguarde seus amigos postarem.
                  </p>
                  <button 
                    onClick={() => document.querySelector('textarea')?.focus()}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-sm"
                  >
                    Criar Primeira Postagem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}