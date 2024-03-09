export type Where = {
  id?: string | number;
  [key: string]: any;
};

export interface DBMethods {
  find<T>(where: Where): Promise<T[]>;
  create(data: Record<string, any>): Promise<void>;
  update(where: Where, data: Record<string, any>): Promise<void>;
  delete(where: Where): Promise<boolean>;
}

export abstract class ORM {
  entities: Record<string, DBMethods> = {};

  abstract register(constructors: any[]): Promise<void>;

  abstract connect(): Promise<ORM>;

  abstract disconnect(): Promise<void>;
}

