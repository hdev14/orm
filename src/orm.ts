type Where = {
  id?: string | number;
  [key: string]: any;
};

export interface DBMethods {
  find<T>(where: Where): Promise<T | null>;
  create(data: Record<string, any>): Promise<void>;
  update(where: Where, data: Record<string, any>): Promise<void>;
  delete(where: Where): Promise<boolean>;
}

export class ORM {
  private static instance: ORM;
  public entities: Record<string, DBMethods>;

  protected constructor(entity_names: string[]) {
    this.entities = entity_names.reduce((acc, entity_name) => {
      if (!acc[entity_name]) {
        acc[entity_name] = {
          find: async (where: Where) => {
            console.log('test');
            return {} as any;
          },
          create: async (data: Record<string, any>) => {
            console.log('test');
          },
          update: async (where: Where, data: Record<string, any>) => {
            console.log('test');
          },
          delete: async (where: Where) => {
            console.log('test');
            return true;
          }
        }
      }

      return acc
    }, {} as Record<string, DBMethods>);
  }

  static register(constructors: any[]) {
    const entity_names = constructors.map((ctor) => ctor.name);

    ORM.instance = new ORM(entity_names);
  }

  static connect(): Promise<ORM> {
    return Promise.resolve(ORM.instance!);
  }

  disconnect(): Promise<void> {
    throw new Error('not implemented');
  }
}

