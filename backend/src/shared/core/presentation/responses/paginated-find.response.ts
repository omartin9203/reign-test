import { PaginatedFindResult } from '../../PaginatedFindResult';
import { Int, Field, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export default function getGenericPaginatedFindResult<T>(
  Type: ClassType<T>,
): ClassType<PaginatedFindResult<T>> {
  type GenericPaginatedFindParams<T> = {
    items: T[];
    limit: number;
    currentPage: number;
    totalPages: number;
  };
  @ObjectType({ isAbstract: true })
  class GenericPaginatedFindResponse implements PaginatedFindResult<T> {
    constructor(data: GenericPaginatedFindParams<T>) {
      this.items = data.items;
      this.limit = data.limit;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
    }
    @Field(() => [Type])
    items: T[];
    @Field(() => Int)
    limit: number;
    @Field(() => Int)
    currentPage: number;
    @Field(() => Int)
    totalPages: number;
  }
  return GenericPaginatedFindResponse;
}
