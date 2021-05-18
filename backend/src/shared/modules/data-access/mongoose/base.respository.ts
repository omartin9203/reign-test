import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { Logger } from '@nestjs/common';
import { PersistentEntity } from './base.entity';
import { IEntity } from 'src/shared/core/interfaces/IEntity';
import { PageParams } from '../../../core/PaginatorParams';
import { PaginatedFindResult } from '../../../core/PaginatedFindResult';
import {UniqueEntityID} from "../../../domain/UniqueEntityID";
import Optional from "../../../core/Option";
import {WhereType} from "../../../core/types/base-where.type";
import {OrderByType} from "../../../core/types/base-orderBy.type";
import {buildWhereFromWhereType} from "./where.builder";
import {Result} from "../../../core/Result";
import {AppError} from "../../../core/errors/AppError";
import {FilterQuery, Model, UpdateQuery} from 'mongoose';


export type FilterableFieldsType<T> = {
  [K in keyof T]?: unknown;
};

export class BaseRepository<
  E extends IEntity,
  P extends PersistentEntity,
  FilterableFields extends FilterableFieldsType<P>
>
  implements IRepository<E, FilterableFields, never> {

  protected readonly _logger: Logger;

  protected constructor(
    protected readonly _model: Model<P>,
    private readonly _domainToPersistentFunc: (domainEntity: E) => Partial<P>,
    readonly _persistentToDomainFunc: (entity: P) => E,
    context: string,
  ) {
    this._logger = new Logger(context);
  }

  protected transform(x?: any): P | undefined {
    if (!x) {
      return undefined;
    }
    const entity: any = {};
    Object.keys(x)
      .filter(key => key !== '_id')
      .forEach(key => (entity[key] = x[key]));
    entity.id = x._id;
    return entity;
  }

  async save(entity: E): Promise<void> {
    this._logger.debug(`Save entity with id: {${entity._id}}`);
    await new this._model(this._domainToPersistentFunc(entity)).save();
  }

  async saveMany(entities: E[]): Promise<void> {
    let subArr = new Array<E>();
    while (entities.length > 0) {
      if (entities.length > 500) subArr = entities.splice(0, 500);
      else subArr = entities.splice(0, entities.length);
      await this._model.create(
        subArr.map((entity: E) => {
          this._logger.debug(`Save entity with id: {${entity._id}}`);
          return this._domainToPersistentFunc(entity);
        })
      );
    }
  }

  async drop(entity: E): Promise<void> {
    this._logger.log(`Drop entity with id: {${entity._id}}`);
    await this._model.findByIdAndDelete(entity._id.toString());
  }

  /**
   *
   * @deprecated
   * @protected
   * @param {PageParams} [pageParam]
   * @returns  {SkipAndLimitType}
   * @memberof BaseRepository
   */
  protected extractLimitAndSkip(pageParam?: PageParams): SkipAndLimitType {
    const limit = pageParam?.pageLimit || 10;
    const page = pageParam?.pageNum || 1;
    const skip = limit * (page - 1);
    return { skip, take: limit };
  }

  /**
   *
   *
   * @protected
   * @param {number} [pageLimit=10]
   * @param {number} [pageNumber=1]
   * @returns  {SkipAndLimitType}
   * @memberof BaseRepository
   */
  protected extractLimitAndSkipFromRaw(
    pageLimit = 10,
    pageNumber = 1,
  ): SkipAndLimitType {
    const skip = pageLimit * (pageNumber - 1);
    return { skip, take: pageLimit };
  }

  protected buildPaginated<E>(
    skip: number,
    limit: number,
    count: number,
    items: E[],
  ): PaginatedFindResult<E> {
    const totalPages: number = Math.ceil(count / limit);
    const currentPage: number = Math.min(skip / limit + 1, totalPages);
    return {
      items,
      limit,
      currentPage,
      totalPages,
    };
  }

  async findById(
    id: UniqueEntityID,
    includes: (keyof P)[] = [],
  ): Promise<Optional<E>> {
    const entity = await this._model
      .findById(id.toString())
      .populate(includes.map(field => ({ path: field})))
      .lean();
    return Optional(entity).map(this.transform).map(this._persistentToDomainFunc);
  }

  async findOne(
    where?: WhereType<FilterableFields>,
    orderBy?: OrderByType<FilterableFields>,
    includes: (keyof P)[] = [],
  ): Promise<Optional<E>> {
    const entity = await this._model
      .findOne(this.buildWhere(where))
      .sort(this.buildSort(orderBy))
      .populate(includes.map(field => ({ path: field})))
      .lean();
    return Optional(entity).map(this.transform).map(this._persistentToDomainFunc);
  }

  async getAllPaginated(
    pageParams?: PageParams,
    where?: WhereType<FilterableFields>,
    orderBy?: OrderByType<FilterableFields>,
    includes: (keyof P)[] = [],
  ): Promise<PaginatedFindResult<E>> {
    const { skip, take } = this.extractLimitAndSkipFromRaw(pageParams?.pageLimit, pageParams?.pageNum);
    const count = await this._model.countDocuments(this.buildWhere(where));
    const items = await this._model
      .find(this.buildWhere(where))
      .sort(this.buildSort(orderBy))
      .populate(includes.map(x => ({path: x})))
      .skip(skip)
      .limit(take)
      .lean();
    return this.buildPaginated(
      skip,
      take,
      count,
      items.map(this.transform).map(this._persistentToDomainFunc),
    );
  }

  async exist(where: WhereType<FilterableFields>): Promise<boolean> {
    return await this._model.exists(this.buildWhere(where));
  }

  protected buildWhere(where?: WhereType<FilterableFields>): FilterQuery<P> {
    return buildWhereFromWhereType(where);
  }

  protected buildSort(orderBy?: OrderByType<FilterableFields>): unknown {
    const fixed = {};
    Object.keys(orderBy ?? {}).forEach(key => fixed[key] = orderBy[key].toString().toLowerCase());
    return fixed;
  }

  async *getAllIterable(
    where?: WhereType<FilterableFields>,
    orderBy?: OrderByType<FilterableFields>,
    includes?: never[],
    bashSize = 10,
  ): AsyncGenerator<Result<E>> {
    let page = 1;
    let hasNext = true;
    do {
      const pageParam = PageParams.create({
        pageNum: page++,
        pageLimit: bashSize,
      });
      if (pageParam.isFailure) {
        hasNext = false;
        yield Result.Fail<E>(pageParam.unwrapError());
      } else {
        try {
          const { items, currentPage, totalPages } = await this.getAllPaginated(
            pageParam.unwrap(),
            where,
            orderBy,
            includes,
          );
          hasNext = currentPage < totalPages;
          for (const item of items) yield Result.Ok<E>(item);
        } catch (error) {
          const respErr = new AppError.UnexpectedError(error);
          this._logger.error(respErr);
          yield Result.Fail<E>(respErr);
        }
      }
    } while (hasNext);
  }
}


type SkipAndLimitType = {
  skip: number;
  take: number;
};
