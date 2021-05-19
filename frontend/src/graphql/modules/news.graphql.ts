import {gql} from "apollo-boost";
import {PAGINATED_NEWS_FRAGMENT} from "../fragments/news/paginated-news.fragment";

const PAGINATED_FIND_NEWS = gql`
    query($pageParams: PageParamsInput!, $where: [WhereNewsInput!]!, $order: OrderByNewsInput){
        findNews(pageParams: $pageParams, where: $where, order: $order) {
            ...PaginatedNewsFragment
        }
    }
    ${PAGINATED_NEWS_FRAGMENT}
`;

const DISABLE_NEWS = gql`
    mutation($id: ID!) {
        disableNews(newsId: $id) {
            success
        }
    }
`;

export default {
  queries: {
    PAGINATED_FIND_NEWS,
  },
  mutations: {
    DISABLE_NEWS,
  }
}