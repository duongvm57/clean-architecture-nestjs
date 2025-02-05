export interface IBaseRepository<E> {
  create(data: E, options?: object, queryRunner?: object): Promise<E>;
  bulkCreate(data: E[], options?: object, queryRunner?: object): Promise<E[]>;
  update(
    id: number,
    data: E,
    queryRunner?: object,
    options?: object,
  ): Promise<object>;
  upsert(
    data: E | E[],
    queryRunner?: object,
    options?: object,
  ): Promise<E | E[]>;
  findByFilter(
    filter: Array<E> | object,
    select?: object,
    relations?: object,
    order?: object,
  ): Promise<E[]>;
  findOneByFilter(
    filter: Array<E> | object,
    select?: object,
    relations?: object,
    order?: object,
  ): Promise<E>;
  delete(id: number, queryRunner?: object, option?: object): Promise<object>;
  bulkDelete(
    ids: number[],
    queryRunner?: object,
    option?: object,
  ): Promise<any>;
  deleteBy(where): Promise<any>;
}