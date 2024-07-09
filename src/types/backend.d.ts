import exp from "constants";

export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface AccessTokenResponse {
  access_token: string;
}

export interface IAccount {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: {
      _id: string;
      name: string;
    };
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  role?: {
    _id: string;
    name: string;
  };

  company?: {
    _id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
export class StoreCategory {
  id: number;
  code: string;
  name: string;
  prioritize: number;
}
export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}
