import {PageParamsDto} from "../../../shared/core/PaginatorParams";
import {OrderByNews, WhereNews} from "../../domain/interfeces/INewsRepository";

export type PaginatedFindNewsUseCaseDto = {
  pageParams: PageParamsDto;
  where?: WhereNews;
  order?: OrderByNews;
}
