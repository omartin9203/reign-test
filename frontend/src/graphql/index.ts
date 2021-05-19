import news from './modules/news.graphql';
export const graphql = {
  queries: {
    news: news.queries,
  },
  mutations: {
    news: news.mutations,
  },
  subscriptions: {

  }
};
