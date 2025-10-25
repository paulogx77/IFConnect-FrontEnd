import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api';

interface Notificacao {
  id: string;
  mensagem: string;
  lida: boolean;
}

const useNotificacoes = (usuarioId: string) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    const carregarNotificacoes = async () => {
      try {
        const data = await fetchFromAPI(`/notificacoes/${usuarioId}`);
        setNotificacoes(data);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    if (usuarioId) {
      carregarNotificacoes();
    }
  }, [usuarioId]);

  return notificacoes;
};

export default useNotificacoes;