import 'reflect-metadata';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import {ConnectedRouter} from 'connected-react-router'
import { createBrowserHistory } from 'history'
import configureStore from "./stores/configureStore";
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "./utils/apollo";

const baseUrl = document.getElementsByTagName('base').item(0)?.getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl as string } as any);
const initialState = (window as any).initialReduxState as any;

const store = configureStore(history, initialState);


ReactDOM.render(
  <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
      <Suspense fallback={null}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Suspense>
    </ConnectedRouter>
  </ReduxProvider>,
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
