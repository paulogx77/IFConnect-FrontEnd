const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Dados simulados mais robustos
const usuariosSimulados = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com' },
  { id: '4', nome: 'Ana Costa', email: 'ana@email.com' },
  { id: '5', nome: 'Carlos Lima', email: 'carlos@email.com' },
];

let postagensSimuladas = [
  {
    id: '1',
    conteudo: 'Esta é minha primeira postagem no IFConnect! Que plataforma incrível! 🚀 Estou animado para conectar com todos vocês.',
    autor: usuariosSimulados[0],
    dataCriacao: new Date().toISOString(),
    curtidas: [{ usuarioId: '2' }, { usuarioId: '3' }],
    comentarios: [
      {
        id: '1',
        texto: 'Bem-vindo ao IFConnect, João! 🎉',
        autor: usuariosSimulados[1],
        dataCriacao: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2', 
    conteudo: 'Acabei de me juntar ao IFConnect. Alguém quer ser meu amigo? 👋 Estou procurando pessoas para colaborar em projetos!',
    autor: usuariosSimulados[1],
    dataCriacao: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    curtidas: [{ usuarioId: '1' }, { usuarioId: '3' }, { usuarioId: '4' }],
    comentarios: [
      {
        id: '2',
        texto: 'Claro! Vamos nos conectar!',
        autor: usuariosSimulados[0],
        dataCriacao: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '3',
    conteudo: 'Desenvolvendo um projeto novo com React e Next.js. Alguém mais ama essas tecnologias? 💻 Compartilhem suas experiências!',
    autor: usuariosSimulados[2],
    dataCriacao: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    curtidas: [{ usuarioId: '1' }, { usuarioId: '4' }],
    comentarios: []
  },
  {
    id: '4',
    conteudo: 'Hoje é um ótimo dia para aprender algo novo! 📚 O que vocês estão estudando atualmente?',
    autor: usuariosSimulados[3],
    dataCriacao: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    curtidas: [{ usuarioId: '2' }, { usuarioId: '5' }],
    comentarios: [
      {
        id: '3',
        texto: 'Estou aprendendo TypeScript!',
        autor: usuariosSimulados[2],
        dataCriacao: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

let curtidasSimuladas: any[] = [
  { id: '1', postagemId: '1', usuarioId: '2' },
  { id: '2', postagemId: '1', usuarioId: '3' },
  { id: '3', postagemId: '2', usuarioId: '1' },
  { id: '4', postagemId: '2', usuarioId: '3' },
  { id: '5', postagemId: '2', usuarioId: '4' },
  { id: '6', postagemId: '3', usuarioId: '1' },
  { id: '7', postagemId: '3', usuarioId: '4' },
  { id: '8', postagemId: '4', usuarioId: '2' },
  { id: '9', postagemId: '4', usuarioId: '5' },
];

let comentariosSimulados: any[] = [
  {
    id: '1',
    postagemId: '1',
    usuarioId: '2',
    texto: 'Bem-vindo ao IFConnect, João! 🎉',
    autor: usuariosSimulados[1],
    dataCriacao: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    postagemId: '2',
    usuarioId: '1',
    texto: 'Claro! Vamos nos conectar!',
    autor: usuariosSimulados[0],
    dataCriacao: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    postagemId: '4',
    usuarioId: '2',
    texto: 'Estou aprendendo TypeScript!',
    autor: usuariosSimulados[2],
    dataCriacao: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  }
];

export const fetchFromAPI = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`🔵 API Call: ${endpoint}`, options);

  // Simulação com delay mais realista
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Tentar chamar a API real primeiro (se disponível)
    if (!endpoint.includes('/amizades')) { // Evitar chamadas que sabemos que falham
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('🟡 API não disponível, usando dados simulados');
  }

  // Fallback para dados simulados
  const method = options.method || 'GET';
  
  // Extrair parâmetros da URL
  const urlParts = endpoint.split('/');
  const resource = urlParts[1];
  const param = urlParts[2];

  switch (resource) {
    case 'usuarios':
      if (param) {
        return usuariosSimulados.find(u => u.id === param) || usuariosSimulados[0];
      }
      return usuariosSimulados;
    
    case 'postagens':
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        const autor = usuariosSimulados.find(u => u.id === body.autorId) || usuariosSimulados[0];
        const novaPostagem = {
          id: Date.now().toString(),
          conteudo: body.conteudo,
          autor: autor,
          dataCriacao: new Date().toISOString(),
          curtidas: [],
          comentarios: []
        };
        postagensSimuladas.unshift(novaPostagem);
        return novaPostagem;
      }
      
      if (param && endpoint.includes('/usuario/')) {
        const userId = endpoint.split('/').pop();
        return postagensSimuladas.filter(p => p.autor.id === userId);
      }
      
      return postagensSimuladas;
    
    case 'curtidas':
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        const usuario = usuariosSimulados.find(u => u.id === body.usuarioId) || usuariosSimulados[0];
        const novaCurtida = {
          id: Date.now().toString(),
          postagemId: body.postagemId,
          usuarioId: body.usuarioId,
          usuario: usuario
        };
        curtidasSimuladas.push(novaCurtida);
        
        // Atualiza a postagem correspondente
        const postagemIndex = postagensSimuladas.findIndex(p => p.id === body.postagemId);
        if (postagemIndex !== -1) {
          if (!postagensSimuladas[postagemIndex].curtidas) {
            postagensSimuladas[postagemIndex].curtidas = [];
          }
          postagensSimuladas[postagemIndex].curtidas.push({ usuarioId: body.usuarioId });
        }
        
        return novaCurtida;
      }
      
      if (method === 'DELETE') {
        const body = JSON.parse(options.body as string);
        const postagemId = param;
        
        curtidasSimuladas = curtidasSimuladas.filter(
          c => !(c.postagemId === postagemId && c.usuarioId === body.usuarioId)
        );
        
        const postagemIndex = postagensSimuladas.findIndex(p => p.id === postagemId);
        if (postagemIndex !== -1 && postagensSimuladas[postagemIndex].curtidas) {
          postagensSimuladas[postagemIndex].curtidas = postagensSimuladas[postagemIndex].curtidas.filter(
            (c: any) => c.usuarioId !== body.usuarioId
          );
        }
        
        return { success: true };
      }
      
      if (param) {
        return curtidasSimuladas.filter(c => c.postagemId === param);
      }
      return curtidasSimuladas;
    
    case 'comentarios':
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        
        // CORREÇÃO: Garantir que o autor nunca seja undefined
        const autorEncontrado = usuariosSimulados.find(u => u.id === body.usuarioId);
        const autor = autorEncontrado || { 
          id: body.usuarioId, 
          nome: 'Usuário', 
          email: 'usuario@email.com' 
        };
        
        const novoComentario = {
          id: Date.now().toString(),
          postagemId: body.postagemId,
          usuarioId: body.usuarioId,
          texto: body.texto,
          autor: autor, // ✅ Agora sempre definido
          dataCriacao: new Date().toISOString()
        };
        
        comentariosSimulados.push(novoComentario);
        
        // Atualiza a postagem correspondente
        const postagemIndex = postagensSimuladas.findIndex(p => p.id === body.postagemId);
        if (postagemIndex !== -1) {
          if (!postagensSimuladas[postagemIndex].comentarios) {
            postagensSimuladas[postagemIndex].comentarios = [];
          }
          postagensSimuladas[postagemIndex].comentarios.push(novoComentario);
        }
        
        return novoComentario;
      }
      
      if (param) {
        return comentariosSimulados.filter(c => c.postagemId === param);
      }
      return comentariosSimulados;
    
    case 'amizades':
      if (endpoint.includes('/amigos/')) {
        const userId = endpoint.split('/').pop();
        return usuariosSimulados.filter(u => u.id !== userId).slice(0, 3);
      }
      
      if (endpoint.includes('/verificar/')) {
        const amigoId = endpoint.split('/').pop();
        return { 
          ehAmigo: Math.random() > 0.5, 
          amigo: usuariosSimulados.find(u => u.id === amigoId) 
        };
      }
      
      if (endpoint.includes('/adicionar') && method === 'POST') {
        return { success: true, message: 'Amigo adicionado com sucesso!' };
      }
      
      return [];
    
    default:
      return [];
  }
};