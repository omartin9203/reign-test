import { gql } from "apollo-boost";
import {NEWS_FRAGMENT} from "./news.fragment";

export const PAGINATED_NEWS_FRAGMENT = gql`
    fragment PaginatedNewsFragment on PaginatedFindNewsResult {
        currentPage
        totalPages
        limit
        items{
            ...NewsFragment
        }
    }
    ${NEWS_FRAGMENT}
`;
