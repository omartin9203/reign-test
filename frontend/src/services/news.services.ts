import {OrderByNews, WhereNews} from "../interfaces/dto/news/filter-news.dto";
import {PaginatedFindResult} from "../interfaces/core/PaginatedFindResult";
import {NewsDto} from "../interfaces/dto/news/news.dto";
import {PageParamsDto} from "../interfaces/core/page-params.dto";
import {ApolloServices} from "./apollo.services";
import {graphql} from "../graphql";
import {ResponseData} from "../interfaces/core/Response";
import {SuccessResponse} from "../interfaces/core/SuccessResponse";
import {Notice} from "../components/notification/Notification";

export class NewsServices extends ApolloServices {
  async disableNews(id: string): Promise<ResponseData<SuccessResponse>> {
    try {
      const { data } = await this.apollo.query({
        query: graphql.mutations.news.DISABLE_NEWS,
        variables: { id },
        fetchPolicy: "no-cache"
      });
      return {
        success: true,
        result: data['disableNews'],
      };
    } catch (e) {
      Notice.error(e.message ?? e.toString());
      return {
        success: false,
        message: e.message || e.toString(),
      }
    }

  }

  async filterNews(
    pageParams: PageParamsDto,
    where?: WhereNews,
    order?: OrderByNews
  ): Promise<ResponseData<PaginatedFindResult<NewsDto>>> {
    try {
      const { data } = await this.apollo.query({
        query: graphql.queries.news.PAGINATED_FIND_NEWS,
        variables: { pageParams, where, order },
        fetchPolicy: "no-cache"
      });
      return {
        success: true,
        result: data['findNews'],
      };
    } catch (e) {
      Notice.error(e.message ?? e.toString());
      return {
        success: false,
        message: e.message ?? e.toString(),
      }
    }
  }
}
