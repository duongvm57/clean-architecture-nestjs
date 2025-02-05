import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { IBaseRepository } from '../../domain/repositories/base.repository.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationType } from '../../domain/config/pagination.interface';

/**
 * Base repository class for projects.
 */
@Injectable()
export abstract class BaseRepository<E extends BaseEntity>
  implements IBaseRepository<E> {
  protected constructor(
    private readonly repository: Repository<E>,
    private readonly alias: string,
  ) {
  }

  async create(
    data: DeepPartial<E>,
    options?: SaveOptions,
    _queryRunner?: QueryRunner,
  ): Promise<E> {
    if (_queryRunner) {
      return _queryRunner.manager
        .getRepository<E>(this.repository.target)
        .save(data, options);
    }
    return this.repository.save(data, options);
  }

  bulkCreate(
    data: DeepPartial<E>[],
    options?: SaveOptions,
    _queryRunner?: QueryRunner,
  ): Promise<E[]> {
    if (_queryRunner) {
      return _queryRunner.manager
        .getRepository(this.repository.target)
        .save(data, options);
    }
    return this.repository.save(data, options);
  }

  update(
    id: number,
    data: DeepPartial<E>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(this.alias).update(id, data);
    }
    return this.repository.update(id, data as QueryDeepPartialEntity<E>);
  }

  upsert<T extends DeepPartial<E>>(
    data: T | T[],
    queryRunner?: QueryRunner,
  ): Promise<(T & E) | (T & E)[]> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.repository.target)
      : this.repository;
    const dataCreatedEntity = Array.isArray(data)
      ? repo.create(data)
      : repo.create(data as T);

    return Array.isArray(dataCreatedEntity)
      ? repo.save(dataCreatedEntity as T[])
      : repo.save(dataCreatedEntity as T);
  }

  findByFilter(
    filter: FindOptionsWhere<E>[] | FindOptionsWhere<E>,
    select?: FindOptionsSelect<E>,
    relations?: FindOptionsRelations<E>,
    order?: FindOptionsOrder<E>,
  ): Promise<E[]> {
    return this.repository.find({
      where: filter,
      select,
      relations,
      order,
    });
  }

  findOneByFilter(
    filter: FindOptionsWhere<E>[] | FindOptionsWhere<E>,
    select?: FindOptionsSelect<E>,
    relations?: FindOptionsRelations<E>,
    order?: FindOptionsOrder<E>,
  ): Promise<E> {
    return this.repository.findOne({
      where: filter,
      select,
      relations,
      order,
    });
  }

  /*
  Example of how to getListsWithPagination

    this.getListsWithPagination({
      page: 1,
      per_page: 10,
      ...(search && { where: { name: Like(`%${search}%`) } }),
      order: { name: 'ASC' },
      relations: ['user'],
    })
  */
  async getListsWithPagination(query: PaginationType<E>) {
    const { page, per_page } = query;
    const limit = per_page || 10;

    const [data, total] = await this.repository.findAndCount({
      take: limit,
      skip: ((page || 1) - 1) * limit,
    });

    return {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      dataList: data,
    };
  }

  delete(id: number, queryRunner?: QueryRunner): Promise<UpdateResult> {
    if (queryRunner) {
      return queryRunner.manager
        .getRepository(this.repository.target)
        .softDelete(id);
    }
    return this.repository.softDelete(id);
  }

  bulkDelete(ids: number[], queryRunner?: QueryRunner): Promise<UpdateResult> {
    if (queryRunner) {
      return queryRunner.manager
        .getRepository(this.repository.target)
        .softDelete(ids);
    }
    return this.repository.softDelete(ids);
  }

  deleteBy(where: FindOptionsWhere<E>, queryRunner?: QueryRunner) {
    return this.repository
      .createQueryBuilder(this.alias, queryRunner)
      .softDelete()
      .where(where)
      .execute();
  }
}