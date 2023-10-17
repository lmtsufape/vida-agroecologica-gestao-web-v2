export interface User {
  name: string;
  email: string;
  password: string;
  apelido: string | null;
  telefone: string;
  cpf: string;
  roles: string[] | number[];
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
  nome: string;
  codigo: string;
  telefone?: string;
  email?: string;
  presidente?: Presidente[] | null;
  presidentes?: Presidente[] | null;
  contato?: Contato[];
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
}

export interface OCS {
  nome: string;
  cnpj: string;
  data_fundacao: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  cep: string;
  bairro_id: number;
  associacao_id: number;
  complemento?: string;
}
