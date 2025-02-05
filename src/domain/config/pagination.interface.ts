import { FindOneOptions, ObjectLiteral } from 'typeorm';

export interface PaginationType<E extends ObjectLiteral>
  extends FindOneOptions<E> {
  per_page?: number;
  page?: number;
  search?: string;
}