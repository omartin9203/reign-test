import {PaginatedFindResult} from "../../interfaces/core/PaginatedFindResult";
import {NewsDto} from "../../interfaces/dto/news/news.dto";
import {ApplicationState, AppThunkAction} from "../index";
import {NewsServices} from "../../services/news.services";
import {PageParamsDto} from "../../interfaces/core/page-params.dto";
import {OrderByNews, WhereNews} from "../../interfaces/dto/news/filter-news.dto";
import {Action, Reducer} from "redux";
import {connect} from "react-redux";

export interface NewsStoreState {
  loading: boolean;
  data: PaginatedFindResult<NewsDto>;
}

interface FilterNewsAsyncAction {
  type: 'FILTER_NEWS_ASYNC';
}

interface SetNewsAction {
  type: 'SET_NEWS';
  data?: PaginatedFindResult<NewsDto>;
}

type KnownAction = FilterNewsAsyncAction | SetNewsAction;

export const actionCreators = {
  getNewsAsync: (
    pageParams: PageParamsDto,
    where?: WhereNews,
    order?: OrderByNews
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const services = new NewsServices();
    dispatch({type: "FILTER_NEWS_ASYNC"});
    services.filterNews(pageParams, where, order)
      .then(data => {
        dispatch({type: "SET_NEWS", data: data.result} as SetNewsAction);
      })
      .catch(e => {
        dispatch({type: "SET_NEWS", data: undefined} as SetNewsAction);
      });
  }
}

const unloadedState: NewsStoreState  = {
  loading: false,
  data: {
    currentPage: 1,
    limit: 20,
    totalPages: 0,
    items: [],
  },
};

export const reducer: Reducer<NewsStoreState> = (state: NewsStoreState | undefined, incomingAction: Action): NewsStoreState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'FILTER_NEWS_ASYNC':
      return {
        ...state,
        loading: true,
      };
    case 'SET_NEWS':
      return {
        ...state,
        loading: false,
        data: action.data ?? state.data,
      };
  }
  return state;
};

export interface WithNewsInfoStoreProps {
  NewsStore: { state: NewsStoreState } & typeof actionCreators;
}

export const withNewsInfoStore = <ICompProps>(component: any): any => {
  type CompProps = ICompProps & WithNewsInfoStoreProps;
  const mergeProps = (state: NewsStoreState, dispatchProps: typeof actionCreators, ownProps: ICompProps): CompProps => {
    return Object.assign(
      {},
      ownProps,
      {
        NewsStore: {
          state,
          ...dispatchProps
        }
      }
    )
  }
  return connect((state: ApplicationState) => state.news!, actionCreators, mergeProps)(component);
};
