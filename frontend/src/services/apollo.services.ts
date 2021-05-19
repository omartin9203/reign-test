import {apolloClient} from "../utils/apollo";
import {ApolloClient} from "@apollo/client";

export class ApolloServices {
  protected apollo: ApolloClient<any>;

  constructor() {
    this.apollo = apolloClient;
  }
}
