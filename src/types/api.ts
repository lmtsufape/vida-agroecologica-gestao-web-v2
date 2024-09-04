export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  apelido?: string | null;
  telefone?: string;
  cpf: string;
  rua?: string;
  numero?: string;
  cep?: string;
  bairro_id?: number;
  roles?:
    | {
        id: number;
        nome: string;
      }[]
    | number[]
    | string[];
  contato?: Contato;
}

export interface Role {
  id: number;
  nome: string;
}

export interface Contato {
  email: string;
  telefone: string;
}

export interface Presidente {
  id: string;
  name: string;
  apelido?: string;
  email: string;
  cpf: string;
}

export interface Associacao {
  id?: number;
  nome: string;
  telefone?: string;
  data_fundacao: string;
  email?: string;
  presidente?: Presidente[] | null;
  presidentes?: Presidente[] | null;
  contato?: Contato;
  rua?: string;
  numero?: string;
  cep?: string;
  bairro_id: number;
  secretarios_id: number[];
  presidentes_id?: number[];
  endereco?: Endereco;
}

export interface Bairro {
  id: number;
  nome: string;
  cidade_id: number;
}

export interface Endereco {
  rua: string;
  numero: string;
  cep: string;
  complemento?: string;
  bairro_id: number;
  bairro?: Bairro;
}

export interface OCS {
  associacao?: {
    nome: string;
  };
  id?: number | string;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  cep?: string;
  complemento?: string;
  bairro_id?: number;
  associacao_id: number;
  agricultores_id: number[];
  contato?: Contato;
  endereco?: Endereco;
}

export interface Reunioes {
  titulo: string;
  pauta: string;
  data: string;
  tipo: string;
  status?: string;
  ata?: string[];
  participantes: {
    name(name: any): string;
    id: number;
  }[];
  associacao_id: number | null;
  organizacao_id?: number | null;
}

export interface APIErrorResponse {
  response?: {
    data?: {
      errors?: {
        [key: string]: string[];
      };
    };
  };
}
