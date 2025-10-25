export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

export interface Postagem {
  id: string;
  conteudo: string;
  autor: Usuario;
  dataCriacao: string;
  curtidas: Curtida[];
  comentarios: Comentario[];
}

export interface Curtida {
  id: string;
  usuario: Usuario;
  postagemId: string;
}

export interface Comentario {
  id: string;
  texto: string;
  autor: Usuario;
  postagemId: string;
  dataCriacao: string;
}