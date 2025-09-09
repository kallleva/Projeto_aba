// filepath: /formulario-app/formulario-app/src/types/index.js
export interface Formulario {
  nome: string;
}

export interface Pergunta {
  texto: string;
  tipo: string;
}

export interface Resposta {
  valor: string;
  perguntaId: number;
}