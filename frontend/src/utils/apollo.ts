import {ApolloClient, InMemoryCache} from '@apollo/client';

const uri = (process.env.REACT_APP_API_URL ?? 'http://localhost:4000') + '/graphql'

export const apolloClient = new ApolloClient({
  uri,
  cache: new InMemoryCache({addTypename: false}),
  // link: wsLink
});
