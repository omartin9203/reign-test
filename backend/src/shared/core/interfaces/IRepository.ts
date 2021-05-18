import {UniqueEntityID} from "../../domain/UniqueEntityID";
import Optional from "../Option";
import {WhereType} from "../types/base-where.type";
import {OrderByType} from "../types/base-orderBy.type";
import {PageParams} from "../PaginatorParams";
import {PaginatedFindResult} from "../PaginatedFindResult";
import {Result} from "../Result";

export interface IRepository<
    E,
    FilterableFields,
    IncludesType extends string,
> {
  /**
   * Persist an entity in the repository, if an entity exists, update it.
   *
   * @param {E} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  save(entity: E): Promise<void> | void;

  /**
   * Persist many entities in the repository, if an entity exists, update it.
   *
   * @param {E} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  saveMany?(entity: E[]): Promise<void> | void;

  /**
   * Drop an entity from the repository.
   *
   * @param {E} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  drop(entity: E): Promise<void> | void;

  findById(
      id: UniqueEntityID,
      includes?: IncludesType[],
  ): Promise<Optional<E>> | Optional<E>;

  findOne(
      where?: WhereType<FilterableFields>,
      orderBy?: OrderByType<FilterableFields>,
      includes?: IncludesType[],
  ): Promise<Optional<E>> | Optional<E>;

  getAllPaginated(
      pageParams?: PageParams,
      where?: WhereType<FilterableFields>,
      orderBy?: OrderByType<FilterableFields>,
      includes?: IncludesType[],
  ): Promise<PaginatedFindResult<E>> | PaginatedFindResult<E>;

  exist(where: WhereType<FilterableFields>): Promise<boolean> | boolean;

  getAllIterable(
      where?: WhereType<FilterableFields>,
      orderBy?: OrderByType<FilterableFields>,
      includes?: IncludesType[],
      bashSize?: number,
  ): AsyncGenerator<Result<E>>
}

export interface IRepositoryFactory<
    E,
    FilterableFields,
    IncludesType extends string,
    R extends IRepository<E, FilterableFields, IncludesType>> {
  build(): R;
}
